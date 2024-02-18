function TL(a: string) {
  var b = 406644
  var b1 = 3293161072

  var jd = '.'
  var $b = '+-a^+6'
  var Zb = '+-3^+b+-f'

  for (var e: number[] = [], f = 0, g = 0; g < a.length; g++) {
    var m = a.charCodeAt(g)
    128 > m
      ? (e[f++] = m)
      : (2048 > m
          ? (e[f++] = (m >> 6) | 192)
          : (55296 == (m & 64512) &&
            g + 1 < a.length &&
            56320 == (a.charCodeAt(g + 1) & 64512)
              ? ((m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                (e[f++] = (m >> 18) | 240),
                (e[f++] = ((m >> 12) & 63) | 128))
              : (e[f++] = (m >> 12) | 224),
            (e[f++] = ((m >> 6) & 63) | 128)),
        (e[f++] = (m & 63) | 128))
  }
  var c = b
  for (f = 0; f < e.length; f++) (c += e[f]), (c = RL(c, $b))
  c = RL(c, Zb)
  c ^= b1 || 0
  0 > c && (c = (c & 2147483647) + 2147483648)
  c %= 1e6
  return c.toString() + jd + (c ^ b)
}

function RL(a: number, b: string) {
  var t = 'a'
  var Yb = '+'
  for (var c = 0; c < b.length - 2; c += 3) {
    var d = b.charAt(c + 2)
    var e = d >= t ? d.charCodeAt(0) - 87 : Number(d)
    var f = b.charAt(c + 1) == Yb ? a >>> e : a << e
    a = b.charAt(c) == Yb ? (a + f) & 4294967295 : a ^ f
  }
  return a
}

function getToken(t: string) {
  return TL(t)
}

export { getToken }
