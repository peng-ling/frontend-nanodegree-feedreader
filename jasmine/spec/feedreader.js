/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */

$(function() {

  /* This is our first test suite - a test suite just contains
   * a related set of tests. This suite is all about the RSS
   * feeds definitions, the allFeeds variable in our application.
   */

  describe('RSS Feeds', function() {

    /* This is our first test - it tests to make sure that the
     * allFeeds variable has been defined and that it is not
     * empty. Experiment with this before you get started on
     * the rest of this project. What happens when you change
     * allFeeds in app.js to be an empty array and refresh the
     * page?
     */

    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });

  });

  /* TODO: Write a test that loops through each feed
   * in the allFeeds object and ensures it has a URL defined
   * and that the URL is not empty.
   */

  describe('feed in allFeeds object have a url defined and url must not be empty', function() {
    it(' // url should be defined', function() {
      allFeeds.forEach(function(item) {
        expect(item.url).toBeDefined();
      });
    });
    it(' // url must not be empty', function() {
      allFeeds.forEach(function(item) {
        expect(!/\S/.test(item.url)).toBe(false);
      });
    });
  });

  /* TODO: Write a test that loops through each feed
   * in the allFeeds object and ensures it has a name defined
   * and that the name is not empty.
   */
  describe('feed in allFeeds object have a name defined and name must not be empty', function() {


    it(' // url should be defined', function() {
      allFeeds.forEach(function(item) {
        expect(item.name).toBeDefined();
      });
    });
    it(' // url must not be empty', function() {
      allFeeds.forEach(function(item) {
        expect(!/\S/.test(item.name)).toBe(false);
      });
    });
  });

  /* TODO: Write a new test suite named "The menu" */
  describe('The menu', function() {

    /* TODO: Write a test that ensures the menu element is
     * hidden by default. You'll have to analyze the HTML and
     * the CSS to determine how we're performing the
     * hiding/showing of the menu element.
     */

    it('menu element is hidden by default', function() {
      expect($('.slide-menu').css('transform')).toBe('matrix(1, 0, 0, 1, -192, 0)');
    });

    /* TODO: Write a test that ensures the menu changes
     * visibility when the menu icon is clicked. This test
     * should have two expectations: does the menu display when
     * clicked and does it hide when clicked again.
     */

    it('menue elemen t shows up when clicked', function() {
      $('.icon-list').trigger('click');
      expect($('body.menu-hidden').length).toBe(0);
    });

    it('menue element hides when clicked', function() {
      $('.icon-list').trigger('click');
      expect($('body.menu-hidden').length).not.toBe(0);
    });
  });

  /* TODO: Write a new test suite named "Initial Entries" */
  describe('Initial Entries', function() {

    /* TODO: Write a test that ensures when the loadFeed
     * function is called and completes its work, there is at least
     * a single .entry element within the .feed container.
     * Remember, loadFeed() is asynchronous so this test will require
     * the use of Jasmine's beforeEach and asynchronous done() function.
     */

    var originalTimeout;

    beforeEach(function(done) {
      loadFeed(0, done);
    });

    it('after load feed there should be at least one entry', function(done) {
      expect($('.feed').find('.entry').length).not.toBe(0);
      done();
    });

  });

  /* TODO: Write a new test suite named "New Feed Selection"*/
  describe('New Feed Selection', function() {

    /* TODO: Write a test that ensures when a new feed is loaded
     * by the loadFeed function that the content actually changes.
     * Remember, loadFeed() is asynchronous.
     */

    beforeEach(function(done) {
      loadFeed(0, done);
    });

    var oldFeedContent = $('.feed').find('.entry').text();

    it('when a new feed is loaded the content actually changes', function(done) {
      loadFeed(1, done);
      expect($('.feed').find('.entry').text()).not.toBe(oldFeedContent);
    });

  });

}());
