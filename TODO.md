# TODO
[ ] it might be a good idea to draw the player's ship a little different, like in front of others. might get lost in the noise
[ ] get design looking better in non-metamask browsers like Safari just so it looks better at a glance
[ ] refactor code to clean up App.js, it's huge
[ ] oh man resizing the window breaks things bad
[ ] left control bar until title that adjusts gas, links to main contract, links to ipfs, and links to github
[ ] bug where buy ship button appears when it shouldn't both at load and after you buyship and you are waiting for embark button

[ ] I'd like the offline demo to be less random... make sure that first page load shows big ships, little ships, clouds, village, etc
      (or maybe it could actually load the real data so you could pull up your phone and see where your live ship is?)
[ ] when you are on the testrpc and you redeploy, blocks go by quickly and the UI is way behind, block check probably needs to happen rapidly
          (you don't want it to miss a block on the live or testnet and sometimes they are real fast)

[ ] Convert fishing ships to Dogger so there isn't an ENUM type
[ ] Sea needs to be rebuilt to be across multiple x,y (multiple lands) and different types of ships

[ ] when you don't use enough gas and you get the 50 blocks warning, the button loaders get weird
[x] bug with centering the buy ship button over the harbor seems to happen when harbor is right next to small island with left edge
[ ] clicking on an inventory item should probably bring up a send modal asking for an address and how many to send? does meta mask have that built in?
[x] scroll should follow user
[x] buttons should follow user
[ ] add a 'cut line' button that sends in the bait hash 0x0
[ ] galleass.eth points to ?
[ ] figure out how to get the contract verified on etherscan (I think clevis will need to output the full source code before it's compiled)
[x] reset avg block time to 15000 or whatever when the network is switched or switching from offline mode to online
[x] favicon - title
[x] https on galleass.io
[x] warning message when on any major network other than ropsten
[x] ipfs deployment
[x] fishing png doesn't have flag right, I think there needs to be a fishing east pic
[x] make event parsing scale.. start with latest and work your way backwards to block number
[x] can you detect metamask changing accounts and reload?
[x] there is an edge case where someone could reload the page after casting their line and their bait / baithash is lost (cookies?)
[x] draw different types of fish
[x] add in fake land tiles just to see how it will look
[x] when you switch accounts in Metamask it should detect the account changed and reload or something
[-] reimplement the multibutton green thumbs up and then green arrow for embark
[x] oceanfront.png is too large, needs to be optimized
