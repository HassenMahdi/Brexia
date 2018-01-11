import { BreaxiaPage } from './app.po';

describe('breaxia App', function() {
  let page: BreaxiaPage;

  beforeEach(() => {
    page = new BreaxiaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
