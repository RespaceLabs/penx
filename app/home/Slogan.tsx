export function Slogan() {
  return (
    <div className="text-center mx-auto space-y-4">
      <div className="text-neutral-7 bg-white border inline-flex rounded-full px-6 py-[6px] font-light">
        A value network for writers
      </div>
      <div className="text-7xl leading-none text-center font-bold space-y-2">
        <div>The space</div>
        <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-red-500 bg-clip-text text-transparent">
          for <span>web3</span> writers
        </div>
      </div>
      <div className="max-w-[500px] text-lg text-neutral-600 text-center mx-auto">
        PenX is an open source alternative to{' '}
        <span className="text-black font-bold">mirror.xyz</span>, check out the
        source code on{' '}
        <a
          href="https://github.com/0xzio/penx"
          target="_blank"
          className="underline decoration-pink-500 text-pink-500"
        >
          GitHub
        </a>
        .
      </div>
    </div>
  )
}
