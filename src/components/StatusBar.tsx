export function StatusBar() {
  return (
    <footer
      className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2"
      role="contentinfo"
      aria-label="ステータスバー"
    >
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span className="text-gray-400 dark:text-gray-500">|</span>
          <span>Version 1.0.0</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>FPS: 60</span>
          <span className="text-gray-400 dark:text-gray-500">|</span>
          <span>Memory: 42MB</span>
        </div>
      </div>
    </footer>
  )
}