"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface FriendsRequestListProps {
  userId: string;
}

const FriendsRequestList: React.FC<FriendsRequestListProps> = (props: FriendsRequestListProps) => {
  const { userId } = props;
  const [requestFollows, setRequestFollows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _requestFollows = await fetch(`/api/friendRequest?userId=${userId}`, {
          method: 'GET',
          headers: {}
        });
        const data = await _requestFollows.json();
        console.log(data);
        if (data) {
          setRequestFollows(data || []);
        } else {
          setRequestFollows([]);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    };

    fetchData();
  }, [userId]);

  return (
    <React.Fragment>
      <div className='px-4 py-2 flex flex-col justify-center items-center gap-4 shadow-md bg-white/20 rounded-md'>
        {requestFollows.length ? (
          requestFollows.map((item) => (
            <div
              className='w-full font-semibold flex justify-between items-center'
              key={item['id']}
            >
              <div className='flex items-center gap-2'>
                <Image
                  src={item['sender']['avatar']}
                  width={32}
                  height={32}
                  alt='Image'
                  loading='lazy'
                  className='size-10 object-cover ring-1 rounded-full'
                />
                <span>{item['sender']['username']}</span>
              </div>
              <div className='flex gap-2 items-center justify-center'>
                <Image
                  src='/images/accept.png'
                  alt='accept'
                  width={20}
                  height={20}
                  loading='lazy'
                  className='size-6 object-cover cursor-pointer'
                />
                <Image
                  src='/images/reject.png'
                  alt='reject'
                  width={20}
                  height={20}
                  loading='lazy'
                  className='size-6 object-cover cursor-pointer'
                />
              </div>
            </div>
          ))
        ) : (
          <div
            className="text-sm text-center text-gray-400"
          >
            Not Request Follows
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default FriendsRequestList;
