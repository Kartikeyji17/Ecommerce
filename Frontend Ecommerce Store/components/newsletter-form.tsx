'use client'

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => { e.preventDefault() }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded bg-accent-foreground text-accent placeholder:text-accent/50"
      />
      <button className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 px-6 py-3 rounded font-medium">
        Subscribe
      </button>
    </form>
  )
}