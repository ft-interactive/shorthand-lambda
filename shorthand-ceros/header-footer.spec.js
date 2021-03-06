/**
 * Tests for Comments task
 */

'use strict';

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const chai = require('chai');
const cheerio = require('cheerio');
const headerFooter = require('./header-footer');

chai.use(require('sinon-chai'));

const expect = chai.expect;
const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });
const ArgsFixture = {
  uuid: '0fb9fc9ff28bec1a871d387c3e788209'
};

describe('headerFooter', () => {
  let $;

  beforeEach(() => {
    $ = cheerio.load(fixture);
  });

  context('Header', () => {
    it('adds the FT header', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('.o-header').is('header')).to.be.true;
      });
    });

    it('adds the paid-post banner with a tooltip', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#disclaimer').is('div')).to.be.true;
        expect(result('#paid-post-tooltip').attr('data-o-component')).to.equal('o-tooltip');
        expect(result('.o-tooltip-content').is('div')).to.be.true;
      });
    });

    it('adds the cuts the mustard script', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#cuts-the-mustard').is('script')).to.be.true;
      });
    });

    it('adds the polyfill script', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#polyfill').is('script')).to.be.true;
        expect(result('#polyfill').attr('src')).to.equal('https://cdn.polyfill.io/v2/polyfill.min.js');
      });
    });

    it('adds the origami build service stylesheet', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('link[rel="stylesheet"]').attr('href')).to.include('https://www.ft.com/__origami/service/build/v2/bundles/css');
      });
    });
  });

  context('Footer ', () => {
    it('adds the FT footer', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('.o-footer').is('footer')).to.be.true;
      });
    });

    it('adds the custom javascript', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#ft-js').is('script')).to.be.true;
      });
    });
  });

  context('Nav', () => {
    it('adds the Nav', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#o-header-drawer').is('div')).to.be.true;
      });
    });
  });

  context('Tooltip', () => {
    it('should replace the tooltip sponsor', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('.disclaimer__sponsor').text()).to.equal('by HIUNDAI');
        expect(result('.paid-post-tooltip__sponsor').text()).to.equal('HIUNDAI');
        expect(result('meta[name="tooltip:sponsor"]').text()).to.not.be.ok;
      });
    });
  });

  context('Origami scripts', () => {
    it('should aggregate origami scripts into one', () => {
      const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index--origami-tag.html'), { encoding: 'utf8' });
      $ = cheerio.load(fixture);

      return headerFooter($, ArgsFixture).then(result => {
        expect(result('head').html()).to.include('https://www.ft.com/__origami/service/build/v2/bundles/css?modules=o-grid@^4.3.3,o-header@^7.2.9,o-footer@^6.0.2,o-typography@^5.1.1,o-colors@^4.1.1,o-tooltip@^3.1.1,o-fonts@^3.0.1,o-share@^6.0.1,o-gallery@^3.0.2,o-normalise@^1.5.1,o-overlay@^2.1.4,o-buttons');
        expect(result('body').text()).to.include('https://www.ft.com/__origami/service/build/v2/bundles/js?modules=o-grid@^4.3.3,o-header@^7.2.9,o-footer@^6.0.2,o-typography@^5.1.1,o-colors@^4.1.1,o-tooltip@^3.1.1,o-tracking,o-viewport,o-fonts@^3.0.1,o-share@^6.0.1,o-gallery@^3.0.2,o-normalise@^1.5.1,o-overlay@^2.1.4,o-buttons');
      });
    });
  });


  // Hard to test this properly as copying and pasting code from n-ui and hacking
  // to work with this app. NAUGHTY. DO IT PROPERLY.
  context('Events', () => {
    it('should return javascript with events', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#ft-events').is('script')).to.be.true;
      });
    });
  });
});
