const serializer: jest.SnapshotSerializerPlugin = {
  print(value) {
    return value.debug().trim();
  },

  test(value) {
    return (
      typeof value === 'object' &&
      !!value &&
      value.isRutRenderer === true &&
      value.constructor.name === 'Renderer'
    );
  },
};

export default serializer;