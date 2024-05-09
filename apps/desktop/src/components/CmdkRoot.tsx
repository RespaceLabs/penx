import { useState } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from 'cmdk'
import { Item } from '@penx/extension-api'

const StyledCommand = styled(Command)
const CommandInput = styled(Command.Input)
const CommandItem = styled(Command.Item)

type CommandItem = {
  command: string
  code: string
}

const list = [
  {
    command: 'math',
    code: `
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../packages/extension-api/dist/types.js
var require_types = __commonJS({
  "../../packages/extension-api/dist/types.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../packages/extension-api/dist/index.js
var require_dist = __commonJS({
  "../../packages/extension-api/dist/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.input = void 0;
    __exportStar(require_types(), exports);
    exports.input = self.input;
  }
});

// src/main.ts
var import_extension_api = __toESM(require_dist());
async function main() {
  console.log("input....123:", import_extension_api.input);
  postMessage({
    type: "list",
    items: [
      {
        title: import_extension_api.input
      }
    ]
  });
}
main();
    `,
  },

  {
    command: 'hello',
    code: `
// main.ts
async function main() {
  postMessage({
    type: "list",
    items: [
      {
        title: "item 1"
      },
      {
        title: "item 2"
      },
      {
        title: "item 3"
      },
    ]
  });
}
main();
    `,
  },
  {
    command: 'add-todo',
    code: 'console.log("Add a todo")',
  },
  {
    command: 'translate',
    code: 'console.log("Translate")',
  },
  {
    command: 'polling',
    code: `
console.log("Hello from Web Worker");
setInterval(() => {
  console.log("123...............", Date.now());
},4000)
    `,
  },
]

const initialItems = list.map((item) => ({
  type: 'command',
  title: item.command,
  data: item.code,
}))

export const CmdkRoot = () => {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<Item[]>(initialItems)

  function handleSelect(item: Item, input = '') {
    // console.log('q-----:', q, 'input:', input)

    if (item.type === 'command') {
      if (!q) setQ(item.title as string)

      let blob = new Blob(
        [`self.input = '${input}'\n` + item.data + `\nself.close()`],
        {
          type: 'application/javascript',
        },
      )
      let url = URL.createObjectURL(blob)
      let worker = new Worker(url)
      // worker.terminate()

      worker.onmessage = async (event: MessageEvent<any>) => {
        if (event.data?.type === 'list') {
          const list: Array<{ title: string }> = event.data.items || []
          console.log('event---:', event.data.items)
          setItems(
            list.map((item) => ({
              title: item.title,
            })),
          )
        }
      }
    }
  }

  return (
    <StyledCommand
      label="Command Menu"
      className="command-panel"
      shadow="0 16px 70px rgba(0,0,0,.2)"
      w={['100%']}
      absolute
      top-0
      left0
      right0
      bottom0
      zIndex-10000
      bgWhite
      loop
      // filter={(value, search) => {
      //   console.log('value:', value, 'search:', search)
      //   return 1
      // }}
    >
      <CommandInput
        id="searchBarInput"
        toCenterY
        bgTransparent
        w-100p
        h-48
        px3
        placeholderGray400
        textBase
        borderBottom
        borderGray200
        outlineNone
        placeholder="Search node"
        autoFocus
        value={q}
        onValueChange={(v) => {
          setQ(v)
          if (v === '') {
            setItems(initialItems)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const [a, b = ''] = splitStringByFirstSpace(q)
            const item = initialItems.find((item) => item.title === a)
            if (item) {
              handleSelect(item, String(b))
            }
          }
        }}
      />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group>
          {items.map((item, index) => {
            const title =
              typeof item.title === 'string' ? item.title : item.title.value
            return (
              <CommandItem
                key={index}
                cursorPointer
                toCenterY
                px2
                py3
                gap2
                value={title}
                onSelect={() => {
                  handleSelect(item)
                }}
                onClick={() => {
                  handleSelect(item)
                }}
              >
                <Box textSM>{title}</Box>
              </CommandItem>
            )
          })}
        </Command.Group>
      </Command.List>
    </StyledCommand>
  )
}

function splitStringByFirstSpace(str: string) {
  const index = str.indexOf(' ')
  if (index === -1) {
    return [str]
  }

  const firstPart = str.substring(0, index)
  const secondPart = str.substring(index + 1).trim()

  return [firstPart, secondPart]
}
