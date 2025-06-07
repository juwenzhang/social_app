"use client";
import React, { useState, useOptimistic } from "react";
import { switchFollow, switchBlock } from "@/libs/useraction";

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
    switchOptimisticFollow("follow");
    try {
      const res = await switchFollow(userId, currentUserId!);
      if (res) {
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
    switchOptimisticFollow("block");
    try {
      await switchBlock(userId, currentUserId!);
      useUserState(prev => {
        return {
         ...prev,
          isUserBlocked:!prev.isUserBlocked,
        }
      }) 
    } catch (error) {
      console.log(error);
    }
  }

  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(userState, 
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
            >{ optimisticFollow.isFollowing ? "Following" : optimisticFollow.isFollowingSent ? "Friend Request Sent" : "Follow" }</button>
          </form>
          <form action={handleBlock} className="self-end">
            <button
              className='text-red-400 self-end text-xs cursor-pointer'
            >{ optimisticFollow.isUserBlocked ? "UnBlock User" : "Block User" }</button> 
          </form>
        </>
      }
    </React.Fragment>
  )
}

export default UserInfoCardInteraction;