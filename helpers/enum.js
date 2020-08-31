const rawMod = {
  NM: 0,
  NF: 1,
  EZ: 2,
  HD: 8,
  HR: 16,
  SD: 32,
  DT: 64,
  RX: 128,
  HT: 256,
  NC: 512,
  FL: 1024,
  AT: 2048,
  SO: 4096,
  AP: 8192,
  PF: 16384,
  Key4: 32768,
  Key5: 65536,
  Key6: 131072,
  Key7: 262144,
  Key8: 524288,
  FadeIn: 1048576,
  Random: 2097152,
  Cinema: 4194304,
  Target: 8388608,
  Key9: 16777216,
  KeyCoop: 33554432,
  Key1: 67108864,
  Key3: 134217728,
  Key2: 268435456,
  ScoreV2: 536870912,
  Mirror: 1073741824
  // TB: 65536
}
// const all = {
//   None: 0,
//   NoFail: 1,
//   Easy: 2,
//   TouchDevice: 4,
//   Hidden: 8,
//   HardRock: 16,
//   SuddenDeath: 32,
//   DoubleTime: 64,
//   Relax: 128,
//   HalfTime: 256,
//   Nightcore: 512, // Only set along with DoubleTime. i.e: NC only gives 576
//   Flashlight: 1024,
//   Autoplay: 2048,
//   SpunOut: 4096,
//   Relax2: 8192, // Autopilot
//   Perfect: 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416
//   Key4: 32768,
//   Key5: 65536,
//   Key6: 131072,
//   Key7: 262144,
//   Key8: 524288,
//   FadeIn: 1048576,
//   Random: 2097152,
//   Cinema: 4194304,
//   Target: 8388608,
//   Key9: 16777216,
//   KeyCoop: 33554432,
//   Key1: 67108864,
//   Key3: 134217728,
//   Key2: 268435456,
//   ScoreV2: 536870912,
//   Mirror: 1073741824
//   KeyMod: Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | KeyCoop,
//   FreeModAllowed: NoFail | Easy | Hidden | HardRock | SuddenDeath | Flashlight | FadeIn | Relax | Relax2 | SpunOut | KeyMod,
//   ScoreIncreaseMods: Hidden | HardRock | DoubleTime | Flashlight | FadeIn
// }
const helper = {
  toEnum (mods) {
    return mods.reduce((acc, mod) => {
      // console.log('convert to rawMod: ', mod, rawMod[mod]);
      if (rawMod[mod] !== undefined) {
        acc += rawMod[mod]
      }
      return acc
    }, 0)
  },
  toModList (rawmod) {
    const mods = Object.entries(rawMod).reduce((acc, [mod, value]) => {
      if (value & rawmod) {
        acc.push(mod)
      }
      return acc
    }, [])
    if (mods.length === 0) {
      mods.push('NM')
    }
    return mods
  }
}

export default helper
