import { Checkbox } from '@/components/ui/checkbox'
import { NodeHandlers } from '@troop.com/tiptap-react-render'
import Image from 'next/image'

export const handlers: NodeHandlers = {
  doc: (props) => <>{props.children}</>,
  paragraph: (props) => (
    <p className="text-[17px] my-4 leading-relaxed">{props.children}</p>
  ),
  text: (props) => <span>{props.node.text}</span>,
  listItem: (props) => {
    return (
      <li className="[&>p]:my-0 list-outside px-0 my-4 list-disc ">
        {props.children}
      </li>
    )
  },
  bulletList: (props) => {
    return <ul className="mx-0 pl-4">{props.children}</ul>
  },
  taskList: (props) => {
    return <div className="my-4">{props.children}</div>
  },
  taskItem: (props) => {
    return (
      <div className="flex items-center gap-1 [&>p]:my-0">
        <Checkbox
          defaultChecked={(props.node.attrs as any)?.checked}
        ></Checkbox>
        {props.children}
      </div>
    )
  },
  image: (props) => {
    const src = (props.node.attrs as any).src as string
    if (src.includes('vercel-storage.com')) {
      return (
        <Image
          src={src}
          alt=""
          className="my-4"
          layout="responsive"
          width={100}
          height={100}
        />
      )
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="my-4 w-full" />
    )
  },
  heading: (props) => {
    const attrs: any = props.node.attrs
    const level = attrs.level
    if (level === 1)
      return (
        <h1 className="font-semibold text-5xl mt-12 mb-6">{props.children}</h1>
      )
    if (level === 2)
      return (
        <h2 className="font-semibold text-4xl mt-10 mb-5">{props.children}</h2>
      )
    return (
      <h3 className="font-semibold text-3xl mt-8 mb-4">{props.children}</h3>
    )
  },
}
