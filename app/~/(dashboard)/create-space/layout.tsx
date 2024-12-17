import { ReactNode } from 'react'

// export const runtime = 'edge'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-bold">Enable Web3</div>
        <div>After enable web3:</div>
        <ul className="list-disc list-inside text-sm text-foreground/60">
          <li>It will create an ERC-20 token for your site</li>
          <li>Can enable web3 membership</li>
          <li>Make your post to be an NFT, and collectible</li>
        </ul>
      </div>
      {children}
    </div>
  )
}
