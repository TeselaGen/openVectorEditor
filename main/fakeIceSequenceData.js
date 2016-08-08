const fakeData = {
  sequence: 'agtttagttaatagaccctatagagagccatatcatcaagagagagtttagttaatagaccctatagagagccatatcatcaagagagagtttagttaatagaccctatagagagccatatcatcaagagagagtttagttaatagaccctatagagagccatatcatcaagagagagtttagttaatagaccctatagagagccatatcatcaagagag',
  name: 'example seq',
  canEdit: true,
  identifier: '123123agag',
  features: [
    {
      type: 'promoter',
      name: 'feat1',
      strand: 1,
      locations: [
        {
          genbankStart: 3,
          end: 55,
        }
      ]
    },
    {
      type: 'cds',
      name: 'feat112312',
      strand: 1,
      locations: [
        {
          genbankStart: 34,
          end: 12,
        }
      ]
    },
    {
      type: 'terminator',
      name: 'feat4124',
      strand: -1,
      locations: [
        {
          genbankStart: 3,
          end: 5,
        }
      ]
    },
  ]
}
export default fakeData
