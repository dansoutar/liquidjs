const chai = require('chai')
const expect = chai.expect
const Liquid = require('../..')
chai.use(require('chai-as-promised'))

describe('trimming', function () {
  var ctx = {name: 'harttle'}

  describe('tag trimming', function () {
    it('should respect trim_tag_left', function () {
      var engine = Liquid({ trim_tag_left: true })
      return expect(engine.parseAndRender(' \n \t{%if true%}foo{%endif%} '))
        .to.eventually.equal('foo ')
    })
    it('should respect trim_tag_right', function () {
      var engine = Liquid({ trim_tag_right: true })
      return expect(engine.parseAndRender('\t{%if true%}foo{%endif%} \n'))
        .to.eventually.equal('\tfoo')
    })
    it('should not trim value', function () {
      var engine = Liquid({ trim_tag_left: true, trim_tag_right: true })
      return expect(engine.parseAndRender('{%if true%}a {{name}} b{%endif%}', ctx))
        .to.eventually.equal('a harttle b')
    })
  })
  describe('value trimming', function () {
    it('should respect trim_value_left', function () {
      var engine = Liquid({ trim_value_left: true })
      return expect(engine.parseAndRender(' \n \t{{name}} ', ctx))
        .to.eventually.equal('harttle ')
    })
    it('should respect trim_value_right', function () {
      var engine = Liquid({ trim_value_right: true })
      return expect(engine.parseAndRender(' \n \t{{name}} ', ctx))
        .to.eventually.equal(' \n \tharttle')
    })
    it('should respect not trim tag', function () {
      var engine = Liquid({ trim_value_left: true, trim_value_right: true })
      return expect(engine.parseAndRender('\t{% if true %} aha {%endif%}\t'))
        .to.eventually.equal('\t aha \t')
    })
  })
  describe('greedy', function () {
    var src = '\n {%-if true-%}\n a \n{{-name-}}{%-endif-%}\n '
    it('should enable greedy by default', function () {
      var engine = Liquid()
      return expect(engine.parseAndRender(src, ctx))
        .to.eventually.equal('aharttle')
    })
    it('should respect to greedy:false by default', function () {
      var engine = Liquid({greedy: false})
      return expect(engine.parseAndRender(src, ctx))
        .to.eventually.equal('\n a \nharttle ')
    })
  })
  describe('markup', function () {
    it('should support trim using markup', function () {
      var engine = Liquid()
      var src = [
        '{%- assign username = "John G. Chalmers-Smith" -%}',
        '{%- if username and username.length > 10 -%}',
        '  Wow, {{ username }}, you have a long name!',
        '{%- else -%}',
        '  Hello there!',
        '{%- endif -%}'
      ].join('\n')
      var dst = 'Wow, John G. Chalmers-Smith, you have a long name!'
      return expect(engine.parseAndRender(src)).to.eventually.equal(dst)
    })
    it('should not trim when not specified', function () {
      var engine = Liquid()
      var src = [
        '{% assign username = "John G. Chalmers-Smith" %}',
        '{% if username and username.length > 10 %}',
        '  Wow, {{ username }}, you have a long name!',
        '{% else %}',
        '  Hello there!',
        '{% endif %}'
      ].join('\n')
      var dst = '\n\n  Wow, John G. Chalmers-Smith, you have a long name!\n'
      return expect(engine.parseAndRender(src)).to.eventually.equal(dst)
    })
  })
})
