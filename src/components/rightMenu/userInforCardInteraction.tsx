"use client";
import React, { useState, useOptimistic } from "react";

interface UserInfoCardInteractionProps {
  userId: string; 
  currentUserId: string | undefined; 
  isUserBlocked: boolean; 
  isFollowing: boolean; 
  isFollowingSent: boolean;
}

const UserInfoCardInteraction = (props: UserInfoCardInteractionProps) => {
  const { userId, currentUserId, isUserBlocked, isFollowing, isFollowingSent } = props;
  const [userState, useUserState] = useState({
    isFollowing: isFollowing,
    isFollowingSent: isFollowingSent,
    isUserBlocked: isUserBlocked,
  })

  const handleFollow = async () => {
    switchOptimistic("follow");
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, currentUserId: currentUserId! }),
      });

      const data = await response.json();
      if (data.success) {
        useUserState(prev => {
          return {
            ...prev,
            isFollowing: prev.isFollowing && false,
            isFollowingSent:!prev.isFollowing && !prev.isFollowingSent ? true : false,
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleBlock = async () => {
    switchOptimistic("block");
    try {
      const response = await fetch('/api/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, currentUserId: currentUserId! }),
      });

      const data = await response.json();
      if (data.success) {
        useUserState(prev => {
          return {
           ...prev,
            isUserBlocked: prev.isUserBlocked,
          }
        }) 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [optimistic, switchOptimistic] = useOptimistic(userState, 
    (state, value: "follow" | "block") => {
    switch(value) {
      case "follow": {
        return {
          ...state,
          isFollowing: state.isFollowing && false,
          isFollowingSent:!state.isFollowing &&!state.isFollowingSent? true : false,
        }
      } 
      case "block": {
        return {
         ...state,
          isUserBlocked: !state.isUserBlocked,
        }
      } 
      default: {
        return {
          ...state,
          isFollowing: state.isFollowing,
          isFollowingSent: state.isFollowingSent,
          isUserBlocked: state.isUserBlocked,
        }
      }
    }
  });
  return (
    <React.Fragment>
      {userId !== currentUserId && !isUserBlocked && 
        <>
          <form action={handleFollow}>
            <button 
              className='
                w-full py-2 font-semibold text-white 
                bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg
                hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500
                cursor-pointer transition-all duration-300 ease-in-out
              '
            >{ optimistic.isFollowing 
                ? "Following" 
                : optimistic.isFollowingSent 
                  ? "Friend Request Sent" 
                  : "Follow" }
            </button>
          </form>
          <form action={handleBlock} className="self-end">
            <button
              className='text-red-400 self-end text-xs cursor-pointer'
            >{ optimistic.isUserBlocked ? "UnBlock User" : "Block User" }</button> 
          </form>
        </>
      }
    </React.Fragment>
  )
}

export default UserInfoCardInteraction;