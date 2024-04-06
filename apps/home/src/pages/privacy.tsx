import { FC, PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'

const Title: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box text3XL fontBold mb2>
      {children}
    </Box>
  )
}

export default function PageHome() {
  useEffect(() => {
    nft(1024, 0.1, 3)
  }, [])

  return (
    <Box textLG py20 leadingNormal maxW-860 mx-auto column gap4>
      <h1 id="privacy-policy">Privacy Policy</h1>
      <p>
        We proudly know absolutely nothing about what you put into PenX and what
        comes out of it.{' '}
      </p>
      <p>
        We don’t track you. We don’t gather, transfer, sell, trade, gamble,
        stir-fry, ferment, decorate, or dance salsa with your data. It’s your
        data — not ours.{' '}
      </p>
      <p>
        In all seriousness, privacy is a number one focus for us at PenX. It’s
        an ethics issue plaguing lots of modern tech companies who could make a
        buck off of your personal matters. We don’t play dirty, which is why
        we’ll tell you exactly how your data is handled.
      </p>
      <h2 id="so-what-do-we-collect-">So what do we collect?</h2>
      <p>
        The bare minimum. There are a few small, anonymous things we keep an eye
        on in order to stay alive as a business.{' '}
      </p>
      <p>
        If you aren’t using a PenX Account, we anonymously chart out trends like
        what buttons are clicked, which features are most used, and how many
        people are using them. There’s no way for us to know who you are. We
        just use this info to improve PenX’s design so your translation stays
        efficient.{' '}
      </p>
      <p>
        If you are using a PenX Account, your notes are synced with our secure
        servers so you can have uninterrupted access on all of your devices.
        Your password is encrypted and no one has access to the database but us
        (for support and debugging). Your saved info also includes your email
        and optionally your name.
      </p>
      <h2 id="what-tools-do-we-use-">What tools do we use?</h2>
      <p>
        On this site we use Google Analytics. All we measure are overall page
        views and referrals. Just doing our best to make you a bit more
        invisible online.{' '}
      </p>
      <p>
        Being invisible comes with perks. We can’t follow you around the web
        with ads. We don’t like ads, either. If we did a good enough job
        impressing you with Mate, you’ll try it out. If not, we’re just glad you
        stopped by.
      </p>
      <h2 id="cookies">Cookies</h2>
      <p>Real life? Delicious. Internet life? Atrocious. </p>
      <p>
        No cookies here. Tons of other sites force you to accept cookies which
        means they are allowed to follow you across the internet with ads. Yuck.
        Google Analytics gives us just enough anonymous info to deliver a great
        product to you or send you on your way. You’re the consumer. Consume
        what you want, not what’s forced. Consume real cookies, not creepy
        digital ones.
      </p>
      <h2 id="google-drive-permission">Google drive permission</h2>
      <p>
        When you start to backup you PenX recovery phrase, PenX will use OAuth
        2.0 to login google with Google drive scope, After OAuth successfully,
        PenX create a file which store PenX recovery phrase to user google
        drive. PenX use and transfer to any other app of information received
        from Google APIs will adhere to{' '}
        <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes">
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. There is a video showing how
        PenX backup recovery phrase to google drive:{' '}
        <a href="https://penx.io/penx-backup-recovery-phrase">
          https://penx.io/penx-backup-recovery-phrase
        </a>
        .
      </p>
      <h2 id="contact-us">Contact us</h2>
      <p>
        Anything you want to know is yours, just give us a shout:
        <br />
        <strong>0xzion.penx@gmail.com</strong>
      </p>
    </Box>
  )
}

function nft(maxSupply: number, minPrice: number, maxPrice: number) {
  let currentSupply = 0
  let tokenId = 0
  let sumFee = 0
  const arr = Array(maxSupply).fill(0)
  console.log('nft.....:', arr)
  for (const i of arr) {
    mintNFT()
  }

  console.log(
    '========sumFee:',
    sumFee.toFixed(2),
    (sumFee * 2500 * 7).toFixed(2),
  )

  function mintNFT() {
    const currentPrice = getCurrentPrice()
    tokenId++
    currentSupply++
    sumFee += currentPrice
    console.log(
      'tokenId:',
      tokenId,
      'currentSupply:',
      currentSupply,
      'currentPrice:',
      currentPrice.toFixed(2),
      'fee:',
      // sumFee.toFixed(2),
      (sumFee * 2500 * 7).toFixed(2),
    )
  }

  function getCurrentPrice() {
    if (currentSupply >= maxSupply) {
      return maxPrice
    } else {
      const priceRange = maxPrice - minPrice
      const priceIncrement = priceRange / maxSupply
      return minPrice + priceIncrement * currentSupply
    }
  }
}
