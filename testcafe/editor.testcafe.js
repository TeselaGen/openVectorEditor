// import { Selector } from 'testcafe'; // first import testcafe selectors

// fixture `Getting Started`// declare the fixture
//     .page `https://devexpress.github.io/testcafe/example`;  // specify the start page


// //then create a test and place your code there
// test('My first test', async t => {
//     await t
//         .typeText('#developer-name', 'John Smith')
//         .click('#submit-button')

//         // Use the assertion to check if the actual header text is equal to the expected one
//         .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
// });

import { Selector } from 'testcafe';

fixture `Editor`
    .page `http://localhost:3344/#/Editor`;

// test('StatusBar', async t => {
//     await t
//         .click(Selector('label').withText('showOptions').find('.bp3-control-indicator'));
// });
test.only("Hotkeys", async t => {
    await t.pressKey("meta + k")
})

// test('Drag in row view', async t => {
//     await t
//         .drag(Selector('[class^="veRowViewPart"]'), 150, 69, {
//             offsetX: 55,
//             offsetY: 11
//         })
//         .click(Selector('[class^="veRowViewFeature"]'))
        
// });

test('Can drag "Plasmid" tab to other side', async t => {
    await t
        .dragToElement(Selector('div').withText('Plasmid').nth(11), Selector('div').withText('Properties').nth(11))
        .click(Selector('.ve-draggable-tabs').nth(1).find('div').withText('Plasmid').nth(1))
        .wait(100)

    await t
        .dragToElement(Selector('div').withText('Linear Map').nth(11), Selector('div').withText('Properties').nth(11))
        .click(Selector('.ve-draggable-tabs').nth(0).find('div').withText('Linear Map').nth(1))
});