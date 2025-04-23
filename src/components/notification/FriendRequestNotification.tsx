import React from "react";

interface FriendRequestNotificationProps {
  notificationId: string;
  username: string;
  avatarUrl: string;
  onAccept: (requestId: string, action: string) => void;
  onReject: (requestId: string, action: string) => void;
}

const FriendRequestNotification: React.FC<FriendRequestNotificationProps> = ({
  notificationId,
  username,
  avatarUrl,
  onAccept,
  onReject,
}) => {
  return (
    <div className="flex items-center border justify-between gap-3 bg-white p-3 rounded-lg shadow hover:shadow-md transition w-full">
      {/* Avatar and Username */}
      <div className="flex items-center gap-3 overflow-hidden">
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <span className="text-sm font-semibold text-gray-800 truncate flex-1">
          {username}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => onAccept(notificationId,"accept")}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(notificationId,"reject")}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequestNotification;
