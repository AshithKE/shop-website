import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { syncProductsFromServer, syncCategoriesFromServer } from '../utils/adminStorage'

const SocketContext = createContext(null)

async function refreshLatestCatalog() {
  try {
    const response = await fetch('/api/catalog')
    if (!response.ok) return
    const data = await response.json()
    if (Array.isArray(data.products)) {
      syncProductsFromServer(data.products)
    }
    if (Array.isArray(data.categories)) {
      syncCategoriesFromServer(data.categories)
    }
  } catch {
    // ignore refresh errors and keep current local data
  }
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connection = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    })

    connection.on('connect', async () => {
      setIsConnected(true)
      await refreshLatestCatalog()
    })

    connection.on('disconnect', () => {
      setIsConnected(false)
    })

    connection.on('connect_error', () => {
      setIsConnected(false)
    })

    setSocket(connection)

    return () => {
      connection.disconnect()
    }
  }, [])

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected])

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    return { socket: null, isConnected: false }
  }
  return context
}
