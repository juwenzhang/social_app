import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

interface CommentEditorProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
                                                       onSubmit,
                                                       placeholder = '写下你的评论...',
                                                       maxLength = 1000
                                                     }) => {
  const { user } = useUser();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]); // 实际应用中应该从API获取

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      if (content.trim()) {
        onSubmit(content);
        setContent('');
      }
      return;
    }

    if (e.key === 'Enter') {
      if (showMentionSuggestions) {
        e.preventDefault();
        return;
      }

      const start = textAreaRef.current?.selectionStart || 0;
      const end = textAreaRef.current?.selectionEnd || 0;

      setContent(prev =>
        prev.substring(0, start) + '\n' + prev.substring(end)
      );

      e.preventDefault();

      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + 1;
          textAreaRef.current.selectionEnd = start + 1;
        }
      }, 0);
      return;
    }

    if (e.key === '@') {
      setShowMentionSuggestions(true);
      setMentionQuery('');
      setTimeout(() => {
        setSuggestedUsers([
          { id: 'user1', username: 'john_doe', avatar: 'https://picsum.photos/seed/user1/40/40' },
          { id: 'user2', username: 'jane_smith', avatar: 'https://picsum.photos/seed/user2/40/40' },
          { id: 'user3', username: 'alice_wonderland', avatar: 'https://picsum.photos/seed/user3/40/40' },
        ]);
      }, 300);
      return;
    }

    if (showMentionSuggestions && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      setMentionQuery(prev => prev + e.key);

    }

    if (e.key === 'Escape' && showMentionSuggestions) {
      e.preventDefault();
      setShowMentionSuggestions(false);
      return;
    }

    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Tab') && showMentionSuggestions) {
      e.preventDefault();
    }

    if ((e.key === ' ' || /[^a-zA-Z0-9]/.test(e.key)) && showMentionSuggestions) {
      setShowMentionSuggestions(false);
    }
  }, [content, onSubmit, showMentionSuggestions]);

  const handleSelectUser = useCallback((user: any) => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    const start = textArea.selectionStart || 0;
    const end = textArea.selectionEnd || 0;

    const mentionText = `@${user.username} `;
    setContent(prev =>
      prev.substring(0, start - mentionQuery.length - 1) + mentionText + prev.substring(end)
    );

    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.selectionStart = start + user.username.length + 1 - mentionQuery.length;
        textAreaRef.current.selectionEnd = textAreaRef.current.selectionStart;
      }
    }, 0);

    setShowMentionSuggestions(false);
  }, [mentionQuery]);

  const handleEmojiClick = useCallback((emoji: string) => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    const start = textArea.selectionStart || 0;
    const end = textArea.selectionEnd || 0;

    setContent(prev =>
      prev.substring(0, start) + emoji + prev.substring(end)
    );

    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.selectionStart = start + emoji.length;
        textAreaRef.current.selectionEnd = textAreaRef.current.selectionStart;
      }
    }, 0);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setTimeout(() => {
      setShowEmojiPicker(false);
    }, 200);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const remainingChars = maxLength - content.length;

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <Image
          src={user?.imageUrl || '/images/default.jpg'}
          alt={user?.username || 'avatar'}
          width={32}
          height={32}
          loading='lazy'
          className='rounded-full object-cover ring-2 ring-gray-300'
        />

        <div className="flex-1 relative">
          <textarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            rows={3}
            className={`
              w-full bg-gray-100 p-2 rounded-lg flex-1
              outline-none placeholder:text-sm
              placeholder:text-gray-400 resize-none scrollbar-hide
              focus:border-blue-500 focus:ring focus:ring-blue-200 
              focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white
              ${isFocused ? 'border border-blue-300' : 'border border-gray-200'}
            `}
            placeholder={placeholder}
          />

          {/* 剩余字符计数 */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {remainingChars >= 0 ? remainingChars : 0}/{maxLength}
          </div>

          {/* @提及建议 */}
          {showMentionSuggestions && suggestedUsers.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
              {suggestedUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                  <span>@{user.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 工具栏 */}
      {isFocused && (
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              if (content.trim()) {
                onSubmit(content);
                setContent('');
              }
            }}
            disabled={!content.trim()}
            className={`px-4 py-1 bg-blue-500 text-white rounded-lg 
                      ${!content.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 transition-colors'}`}
          >
            发布
          </button>
        </div>
      )}

      {/* 表情选择器 */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1 z-10">
          {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
            '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
            '😘', '😗', '😙', '😚', '🤩', '🤔', '🤨', '😐',
            '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐'].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentEditor;