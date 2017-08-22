import { CountPage } from './app.po';

describe('count App', () => {
  let page: CountPage;

  beforeEach(() => {
    page = new CountPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
