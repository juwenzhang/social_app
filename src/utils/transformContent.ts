export function jsonToFormData(json: Record<string, any>) {
  const formData = new FormData();
  Object.keys(json).forEach(key => {
    formData.append(key, json[key]);
  });
  return formData;
}

export function formDataToJson(formData: FormData) {
  const json: Record<string, any> = {};
  formData.forEach((value, key) => {
    json[key] = value;
  });
  return json;
}

export function stringToBase64(str: string): string {
  return Buffer.from(str, 'utf8').toString('base64');
}

export function base64ToString(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function jsonToBase64(jsonData: Record<string, any>): string {
  const jsonString = JSON.stringify(jsonData);
  return Buffer.from(jsonString, 'utf8').toString('base64');
}

export function base64ToJson<T>(base64: string): T {
  const jsonString = Buffer.from(base64, 'base64').toString('utf8');
  return JSON.parse(jsonString) as T;
}


