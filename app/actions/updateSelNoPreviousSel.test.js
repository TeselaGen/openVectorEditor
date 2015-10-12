var updateSelNoPreviousSel = require('./updateSelNoPreviousSel');
describe('updateSelNoPreviousSel updates the selection layer correctly', function () {
	it('caret not moved at all', function (done) {
		updateSelNoPreviousSel({
			caretPosition: 10,
			updatedCaretPos: 10,
		},{},function ({selectionLayer}) {
			selectionLayer.should.be.false;
			done();
		})
	})
	it('caret moved forward 1 bp', function (done) {
		updateSelNoPreviousSel({
			caretPosition: 10,
			updatedCaretPos: 11,
		},{},function ({selectionLayer}) {
			selectionLayer.should.equal({start: 10, end: 10, cursorAtEnd: true, selected: true});
			done();
		})
	})
	it('caret moved backward 1 bp', function (done) {
		updateSelNoPreviousSel({
			caretPosition: 10,
			updatedCaretPos: 11,
		},{},function ({selectionLayer}) {
			selectionLayer.should.equal({start: 9, end: 9, cursorAtEnd: false, selected: true});
			done();
		})
	})
})