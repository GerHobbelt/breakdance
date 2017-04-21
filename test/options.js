'use strict';

var isEqual = require('./support/is-equal');

describe('options', function() {
  describe('.compilers', function() {
    it('should disable the given compiler', function() {
      isEqual.inline('<strong>Foo</strong>', '****', {compiler: {text: false}});
      isEqual.inline('<strong>Foo</strong>', '', {compiler: {strong: false}});
    });

    it('should use a custom compiler', function() {
      isEqual.inline('<strong>Foo</strong>', '**FOO**', {
        compiler: {
          text: function(node) {
            this.emit(node.val.toUpperCase(), node);
          }
        }
      });

      isEqual.inline('<strong>Foo</strong>', '@Foo@', {
        compiler: {
          strong: function(node) {
            this.mapVisit(node);
          },
          ['strong.open']: function(node) {
            this.emit('@', node);
          },
          ['strong.close']: function(node) {
            this.emit('@', node);
          }
        }
      });
    });
  });

  describe('.comments', function() {
    it('should include code comments in generated markdown', function() {
      isEqual.inline('<div>Foo</div><!-- bar -->', 'Foo<!-- bar -->', {comments: true});
      isEqual.inline('<strong>Foo</strong> <!-- bar -->', '**Foo** <!-- bar -->', {comments: true});
    });
  });

  describe('.omit', function() {
    it('should strip the given elements from HTML before converting', function() {
      isEqual('options.omit', {omit: ['.ciu-panel-wrap'], title: true});
    });
  });

  describe('.keepEmpty', function() {
    it('should keep the given tags when empty', function() {
      isEqual.inline('<a href="/some-link"></a>', '[](/some-link)\n', {keepEmpty: 'a'});
      isEqual.inline('<a href="/some-link"></a>', '[](https://github.com/some-link)\n', {domain: 'https://github.com', keepEmpty: 'a'});
      isEqual.inline('<a href="https://some-link.com"></a>', '[](https://some-link.com)\n', {keepEmpty: 'a'});
    });
  });

  describe('.handlers', function() {
    it('should override a handler', function() {
      isEqual.inline('<title>This is a title</title>', '', {
        handlers: {
          title: function(node) {
            this.emit('');
          }
        }
      });

      isEqual.inline('<title>This is a title</title>', 'foo', {
        handlers: {
          title: function(node) {
            this.emit('foo');
          }
        }
      });

      isEqual.inline('<title>This is a title</title>', '# This is a title', {
        handlers: {
          title: function(node) {
            this.emit('# ' + node.val);
          }
        }
      });
    });
  });

  describe('domain', function() {
    it('should prepend the given domain name to non-anchor hrefs', function() {
      isEqual.inline('<a href="/some-link"></a>', '[](https://github.com/some-link)\n', {domain: 'https://github.com'});
      isEqual.inline('<a href="some-link"></a>', '[](https://github.com/some-link)\n', {domain: 'https://github.com'});
      isEqual.inline('<a href="./some-link"></a>', '[](https://github.com/some-link)\n', {domain: 'https://github.com'});
      isEqual.inline('<a href="#some-link"></a>', '[](#some-link)\n', {domain: 'https://github.com'});
    });

    it('should prepend the given domain name to src urls', function() {
      isEqual.inline('<img src="foo.jpg">', '![](https://github.com/foo.jpg)\n', {
        domain: 'https://github.com'
      });

      isEqual.inline('<img src="foo.jpg">', '![](https://github.com/foo.jpg)\n', {
        domain: 'https://github.com'
      });

      isEqual.inline('<img src="foo.jpg">', '![](https://github.com/foo.jpg)\n', {
        domain: 'https://github.com'
      });
    });
  });
});
