"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex p-4 rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="text-muted-foreground">
              We encountered an unexpected error. Don't worry, your data is safe. 
              Please try refreshing the page.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              <Button 
                onClick={() => this.setState({ hasError: false })}
                className="w-full sm:w-auto bg-[#0060A9] hover:bg-[#0060A9]/90"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_VERSION !== 'production' && (
              <div className="mt-8 p-4 rounded-lg bg-muted text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-destructive">{this.state.error?.toString()}</p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
