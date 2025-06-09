export function Header() {
  return (
    <div className="flex flex-col items-center justify-center py-8 border-b border-[#333]">
      <div className="flex items-center gap-2 mb-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="#8a63d2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2 17L12 22L22 17" stroke="#8a63d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#8a63d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-xl font-bold text-accent-purple">ex314.ai | Where Divine Truth Meets Digital Inquiry</h1>
      </div>
      <div className="max-w-2xl text-center text-sm text-gray-custom">
        <p>
          This is a testing space for our Proof of Concept - a Catholic theological AI assistant built with React and
          TypeScript. Guided by Exodus 3:14, "I AM WHO I AM," we seek to explore faith through modern technology.
        </p>
        <p className="mt-2 text-accent-gold">nolapharisee@ex314.ai</p>
      </div>
    </div>
  )
}
