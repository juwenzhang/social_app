class WorkPool<T = any, R = any> {
  private workerUrl: string;
  private poolSize: number;
  private workers: Worker[] = [];
  private freeWorkers: Worker[] = [];
  private waitingTasks: Array<{
    taskData: T;
    transferList: Transferable[];
    resolve: (value: R) => void;
    reject: (reason?: any) => void;
    timeoutId?: NodeJS.Timeout;
  }> = [];
  private taskResolvers = new Map<number, (value: R | PromiseLike<R>) => void>();
  private taskTimeout: number;

  constructor(workerUrl: string, poolSize: number = 4, taskTimeout: number = 30000) {
    this.workerUrl = workerUrl;
    this.poolSize = poolSize;
    this.taskTimeout = taskTimeout;
    this.initPool();
  }

  private initPool() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerUrl);
      this.workers.push(worker);
      this.freeWorkers.push(worker);

      worker.onmessage = (event: MessageEvent<R>) => {
        const { taskId, result } = event.data as { taskId: number; result: R };
        this.handleTaskResult(taskId, result);
        this.releaseWorker(worker);
      };

      worker.onerror = (error: ErrorEvent) => {
        console.error('Worker error:', error);
        const task = this.waitingTasks.shift();
        task?.reject(new Error(`Worker error: ${error.message}`));
        const index = this.workers.indexOf(worker);
        if (index !== -1) {
          this.workers.splice(index, 1);
        }
        const newWorker = new Worker(this.workerUrl);
        this.workers.push(newWorker);
        this.freeWorkers.push(newWorker);
      };
    }
  }

  submitTask(taskData: T, transferList: Transferable[] = []): Promise<R> {
    return new Promise((resolve, reject) => {
      const taskId = Date.now() + Math.random();
      
      const executeTask = (worker: Worker) => {
        const timeoutId = setTimeout(() => {
          this.taskResolvers.delete(taskId);
          reject(new Error(`Task ${taskId} timed out`));
          this.releaseWorker(worker);
        }, this.taskTimeout);
        
        worker.postMessage({ taskId, taskData }, transferList);
        
        this.taskResolvers.set(taskId, (result) => {
          clearTimeout(timeoutId);
          resolve(result);
        });
      };
      
      const worker = this.freeWorkers.shift();
      
      if (worker) {
        executeTask(worker);
      } else {
        this.waitingTasks.push({
          taskData,
          transferList,
          resolve,
          reject,
          timeoutId: setTimeout(() => {
            const index = this.waitingTasks.findIndex(t => t.resolve === resolve);
            if (index !== -1) {
              this.waitingTasks.splice(index, 1);
              reject(new Error(`Task timed out while waiting in queue`));
            }
          }, this.taskTimeout)
        });
      }
    });
  }

  private handleTaskResult(taskId: number, result: R) {
    const resolver = this.taskResolvers.get(taskId);
    if (resolver) {
      resolver(result);
      this.taskResolvers.delete(taskId);
    } else {
      console.warn(`No resolver found for task ${taskId}`);
    }
  }

  private releaseWorker(worker: Worker) {
    if (this.waitingTasks.length > 0) {
      const nextTask = this.waitingTasks.shift()!;
      clearTimeout(nextTask.timeoutId!);
      
      const taskId = Date.now() + Math.random();
      const timeoutId = setTimeout(() => {
        this.taskResolvers.delete(taskId);
        nextTask.reject(new Error(`Task ${taskId} timed out`));
        this.releaseWorker(worker);
      }, this.taskTimeout);
      
      worker.postMessage({ taskId, taskData: nextTask.taskData }, nextTask.transferList);
      
      this.taskResolvers.set(taskId, (result) => {
        clearTimeout(timeoutId);
        nextTask.resolve(result as R);
      });
    } else {
      this.freeWorkers.push(worker);
    }
  }

  async terminate() {
    await Promise.all(Array.from(this.taskResolvers.values()).map(resolver => 
      new Promise(resolver as any)
    ));
    
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.freeWorkers = [];
    this.taskResolvers.clear();
    this.waitingTasks = [];
  }
}

export default WorkPool;