'use client'
import TestComponent from "../components/TestComponent";// Adjust path if needed
import ProtectedRoute from "../ProtectedRoute";

export default function Test() {
  
    return (
      <ProtectedRoute>
        <div>
          <TestComponent/>
        </div>
      </ProtectedRoute>
    )
  }
