## Web

Node design

```js
const spaceNodes = [
  {
    type: 'ROOT',
    children: ['page1 ID', 'page2 ID', 'page3 ID', '...'],
  },

  {
    type: 'DATABASE_ROOT',
    children: ['database1 ID', 'database2 ID', 'database3 ID', '...'],
  },

  {
    type: 'INBOX',
    children: ['node1 ID', 'node2 ID', '...'],
  },

  {
    type: 'TRASH',
    children: ['node1 ID', 'node2 ID', '...'],
  },
]
```
