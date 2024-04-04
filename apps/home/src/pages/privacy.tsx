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
        PenX respects your privacy and is committed to protecting it through our
        compliance with this policy. This policy describes the types of
        information we may collect from you or that you may provide when you use
        PenX and our practices for collecting, using, maintaining, protecting,
        and disclosing that information.
      </p>
      <p>This policy applies to information we collect:</p>
      <ul>
        <li>In the App.</li>
        <li>
          In email, text, and other electronic messages between you and the App.
        </li>
        <li>
          Through mobile and desktop applications you download from the App,
          which provide dedicated non-browser-based interaction between you and
          the App.
        </li>
      </ul>
      <p>It does not apply to information collected by:</p>
      <ul>
        <li>
          Us offline or through any other means, including on any other website
          operated by PenX or any third party (including our affiliates and
          subsidiaries); or
        </li>
        <li>
          Any third party (including our affiliates and subsidiaries), including
          through any application or content (including advertising) that may
          link to or be accessible from or on the App.
        </li>
      </ul>
      <p>
        Please read this policy carefully to understand our policies and
        practices regarding your information and how we will treat it. If you do
        not agree with our policies and practices, your choice is not to use our
        App. By accessing or using this App, you agree to this privacy policy.
        This policy may change from time to time. Your continued use of this App
        after we make changes is deemed to be acceptance of those changes, so
        please check the policy periodically for updates.
      </p>
      <h2 id="information-we-collect-and-how-we-use-it">
        Information We Collect and How We Use It
      </h2>
      <p>
        We collect several types of information from and about users of our App,
        including information:
      </p>
      <ul>
        <li>
          By which you may be personally identified, such as name, email
          address, and Google Drive account information (&quot;personal
          information&quot;);
        </li>
        <li>
          That is about you but individually does not identify you; and/or
        </li>
        <li>
          About your internet connection, the equipment you use to access our
          App, and usage details.
        </li>
      </ul>
      <p>We collect this information:</p>
      <ul>
        <li>Directly from you when you provide it to us.</li>
        <li>
          Automatically as you navigate through the App. Information collected
          automatically may include usage details, IP addresses, and information
          collected through cookies, web beacons, and other tracking
          technologies.
        </li>
      </ul>
      <h2 id="how-we-use-your-information">How We Use Your Information</h2>
      <p>
        We use information that we collect about you or that you provide to us,
        including any personal information:
      </p>
      <ul>
        <li>
          To provide you with the App and its contents, and any other
          information, products, or services that you request from us.
        </li>
        <li>To fulfill any other purpose for which you provide it.</li>
        <li>
          To carry out our obligations and enforce our rights arising from any
          contracts entered into between you and us, including for billing and
          collection.
        </li>
        <li>
          To notify you about changes to our App or any products or services we
          offer or provide though it.
        </li>
      </ul>
      <p>
        We may also use your information to contact you about our own and
        third-parties&#39; goods and services that may be of interest to you. If
        you do not want us to use your information in this way, please adjust
        your user preferences in your account profile.
      </p>
      <h2 id="disclosure-of-your-information">
        Disclosure of Your Information
      </h2>
      <p>
        We may disclose aggregated information about our users, and information
        that does not identify any individual, without restriction.
      </p>
      <p>
        We may disclose personal information that we collect or you provide as
        described in this privacy policy:
      </p>
      <ul>
        <li>To our subsidiaries and affiliates.</li>
        <li>
          To contractors, service providers, and other third parties we use to
          support our business.
        </li>
        <li>To fulfill the purpose for which you provide it.</li>
        <li>
          For any other purpose disclosed by us when you provide the
          information.
        </li>
        <li>With your consent.</li>
        <li>
          To comply with any court order, law, or legal process, including to
          respond to any government or regulatory request.
        </li>
        <li>
          To enforce our rights arising from any contracts entered into between
          you and us, including the App&#39;s Terms of Use.
        </li>
        <li>
          If we believe disclosure is necessary or appropriate to protect the
          rights, property, or safety of PenX, our customers, or others.
        </li>
      </ul>
      <h2 id="your-choices-about-our-collection-use-and-disclosure-of-your-information">
        Your Choices About Our Collection, Use, and Disclosure of Your
        Information
      </h2>
      <p>
        We strive to provide you with choices regarding the personal information
        you provide to us. We have created mechanisms to provide you with
        control over your information:
      </p>
      <ul>
        <li>
          <strong>Tracking Technologies and Advertising.</strong> You can set
          your browser to refuse all or some browser cookies, or to alert you
          when cookies are being sent. If you disable or refuse cookies, please
          note that some parts of this App may then be inaccessible or not
          function properly.
        </li>
        <li>
          <strong>Promotional Offers from PenX</strong>. If you do not wish to
          have your email address used by us to promote our own or third
          parties&#39; products or services, you can opt-out by adjusting your
          user preferences in your account profile. If we have sent you a
          promotional email, you may send us a return email asking to be omitted
          from future email distributions. This opt-out does not apply to
          information provided to PenX as a result of product purchase or
          warranty registration or other transactions.
        </li>
      </ul>
      <h2 id="why-connect-to-google-drive">Why connect to google drive</h2>
      <p>
        PenX is a privacy-first Note-taking App, we connect to your google drive
        to store the recovery phrase which be use to encrypt your data.
      </p>
      <h2 id="accessing-and-correcting-your-information">
        Accessing and Correcting Your Information
      </h2>
      <p>
        You can review and change your personal information by logging into the
        App and visiting your account profile page.
      </p>
      <h2 id="data-security">Data Security</h2>
      <p>
        We have implemented measures designed to secure your personal
        information from accidental loss and from unauthorized access, use,
        alteration, and disclosure. All information you provide to us is stored
        on our secure servers behind firewalls.
      </p>
      <h2 id="changes-to-our-privacy-policy">Changes to Our Privacy Policy</h2>
      <p>
        It is our policy to post any changes we make to our privacy policy on
        this page. If we make material changes to how we treat our users&#39;
        personal information, we will notify you by email to the primary email
        address specified in your account and/or through a notice on the App
        home page. The date the privacy policy was last revised is identified at
        the top of the page. You are responsible for ensuring we have an
        up-to-date active and deliverable email address for you, and for
        periodically visiting our App and this privacy policy to check for any
        changes.
      </p>
      <h2 id="contact-information">Contact Information</h2>
      <p>
        To ask questions or comment about this privacy policy and our privacy
        practices, contact us at: 0xzion.penx@gmail.com.
      </p>
      <p>Thank you for using PenX.</p>
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
