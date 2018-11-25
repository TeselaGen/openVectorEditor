describe('mouse test', function () {
	before('open application', function () {
		cy.visit('https://master-branch-opensphere-ngageoint.surge.sh/?tips=false')
		cy.get('.webgl-canvas', {timeout: 12000}) // map loaded
		cy.get('body').type('+++++++++++++++++++++++++') // zoom in on the map
		cy.get('.close > span').click() // close layers widget
	})

	it('open map context menu', function () {
		cy.get('.webgl-canvas').trigger('contextmenu')  // attempt to open the context menu
		cy.get('#menu') // check for menu
	})

	it('zoom on double click', function () {
		cy.get('.zoom-text').should('have.text', 'Zoom: 6.2')// verify current zoom level
		cy.get('.webgl-canvas')
			.dblclick()
			.dblclick()
			.dblclick()
			.dblclick()
			.dblclick()
			.dblclick()
			.dblclick()
			.dblclick()
		cy.get('.zoom-text').should('not.have.text', 'Zoom: 6.2')// verify current zoom level
	})


	it('load query area (query button)', function () {
		cy.get('[title="Draws a box on the map for queries, zoom, and selection"]').click() // activate query tool
		cy.get('[class="btn btn-primary on active"]') // verify query tool active

		cy.get('body').as('map')
		cy.get('@map') // attempt to draw a query area
			.trigger('mousedown', "center", {force:true})
			.trigger('mousemove', 400, 400, {force:true})
			.trigger('mouseup', 400, 400, {force:true})

		cy.get('#menu') // check for menu
	})

	it('load query area (keyboard and mouse)', function () {
		cy.get('body').as('map')
		cy.get('@map') // attempt to draw a query area
			.type('{ctrl}', {release:false,force:true}).click(400,400)
			.type('{ctrl}', {release:true,force:true}).click(600,600)
			
		cy.get('#menu') // check for menu
	})
})