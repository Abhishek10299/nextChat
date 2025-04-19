"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'

// Define the type for a friend
type Friend = {
  _id: string
  username: string
}

// Define the user data type
type UserData = {
  username: string
  email: string
  profilePicture: string
  friends: Friend[]
}

export default function ProfilePage() {
  const params = useParams()
  const username = (params as { username: string }).username

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${username}`)
        setUserData(response.data.message)
        setLoading(false)
      } catch (err) {
        setError('Failed to load user data')
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  if (loading) return <p className="text-center mt-20">Loading...</p>
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {userData && (
          <>
            <div className="flex items-center space-x-6 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.profilePicture} alt={userData.username} />
                <AvatarFallback>{userData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold capitalize">{userData.username}</h2>
                <p className="text-gray-500">User Profile</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700">
              <div>
                <p className="font-semibold">Email:</p>
                <p>{userData.email}</p>
              </div>

              <div>
                <p className="font-semibold">Total Friends:</p>
                <p>{userData.friends.length}</p>
              </div>

              <div className="md:col-span-2">
                <p className="font-semibold mb-2">Friends List:</p>
                <ul className="list-disc pl-6 space-y-1">
                  {userData.friends.map(friend => (
                    <li key={friend._id}>{friend.username}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
