# lofik

lofik is a library for building local-fist apps. It means that all data is stored on your device and you're in complete control of it.

If you want to sync changes with other device, you just need to copy the seed (like in bitcoin) to your other device. All changes will sync automatically. Any future updates will sync between devices in real-time. These updates use a sync server and are end to end encrypted, so the server cannot understand them. You can either use public sync server running at `lofik.jouzina.com` or your own.

Apps build with lofik can also work offline, store all pending updates locally and sync them with other devices when you're back online.

Currently, lofik consists of two components - tools for building [react app](https://github.com/pycan-jouza/lofik/blob/master/packages/react/README.md) and [sync server](https://github.com/pycan-jouza/lofik/blob/master/packages/server/README.md).

How to build with each, follow the links right above. Also, you can have a look at [examples](https://github.com/pycan-jouza/lofik/blob/master/examples) or at more complex open-source apps below.

## Apps currently using lofik

- [lofextra](https://lofextra.com)
