// const WebAPI = require('./webapi'); 
const WebAPI = require('../webapi.js'); 


describe('WebAPI', () => {
  let webAPI;

  beforeEach(() => {
    webAPI = new WebAPI();
  });

 test('sendFileToGalleryMethod should return correct URL', () => {
    const expectedUrl = '/telegram/shop/1/card/1/media/url';
    expect(webAPI.sendFileToGalleryMethod(1, 1)).toBe(expectedUrl);
  });

  test('sendFileToGalleryMethod should return null if both parameters are null', () => {
    expect(webAPI.sendFileToGalleryMethod()).toBeNull();
  });

  test('sendFileToGalleryMethodPayload should throw PARAM_VALIDATION_FAILED_MESSAGE if product_image_url is empty', () => {
    expect(() => webAPI.sendFileToGalleryMethodPayload()).toThrow(webAPI.PARAM_VALIDATION_FAILED_MESSAGE + ' => url');
  });

  // Допишите остальные тесты для остальных методов класса WebAPI здесь
  test('getMediaFilesForProductCardMethod should return correct URL', () => {
    const expectedUrl = '/telegram/shop/1/card/1/media';
    expect(webAPI.getMediaFilesForProductCardMethod(1, 1)).toBe(expectedUrl);
  });

  test('getMediaFilesForProductCardMethod should return null if both parameters are null', () => {
    expect(webAPI.getMediaFilesForProductCardMethod()).toBeNull();
  });

  test('deleteMediaFromProductCardMethod should return correct URL', () => {
    const expectedUrl = '/telegram/shop/1/card/1/media/1';
    expect(webAPI.deleteMediaFromProductCardMethod(1, 1, 1)).toBe(expectedUrl);
  });

  test('deleteMediaFromProductCardMethod should return null if all parameters are null', () => {
    expect(webAPI.deleteMediaFromProductCardMethod()).toBeNull();
  });

  test('mediaFilesForProductCardCheckedMethod should return correct URL', () => {
    const expectedUrl = '/telegram/shop/1/card/1/media/1/checked';
    expect(webAPI.mediaFilesForProductCardCheckedMethod(1, 1, 1)).toBe(expectedUrl);
  });

  test('mediaFilesForProductCardCheckedMethod should return null if all parameters are null', () => {
    expect(webAPI.mediaFilesForProductCardCheckedMethod()).toBeNull();
  });

});