// Change version/rationale with an intentional rebalance; ranges protect pacing,
// not exact paycheck snapshots. Amounts are game dollars and days are game days.
export const ECONOMY_BALANCE={
 version:2,
 rationale:'v2 replaces automatic shift raises with performance/experience/skill-gated levels; earlier earned wages migrate as a bounded floor. Unsupported jet/yacht ownership is an intentional 10–100× income stress case, not a solvent household target. Starter wages sustain ordinary ownership; comfortable purchases are reachable without businesses. Premium needs saving; Ultra requires late-game capital and recurring income.',
 horizons:[180,365,1095],
 benchmarks:{entry:{id:'chair',shifts:[0,2]},comfortable:{id:'queen_bed',shifts:[3,25]},premium:{id:'sports_car',earliestDay:90,latestDeveloperDay:1095},ultra:{id:'yacht',earliestWageOnlyDay:1096,ladderDay:[365,1095]}},
 starter:{maxBillIncomeRatio:.4,maxNegativeCashDays:0,minCashAt180:1000},
 business:{managedPaybackDays:[35,200],unmanagedPaybackDays:[100,4000],actualManagedPaybackDays:[35,220],actualUnmanagedPaybackDays:[100,4500]},
 wages:{multiplierCeiling:4.5},
 luxury:{minimumNegativeCashDays:90,billIncomeRatio:[10,100],billsAt180:[900000,1000000]},
 scenarios:[
  {id:'barista',career:'barista'},{id:'designer',career:'designer'},{id:'developer',career:'developer'},
  {id:'skilled-developer',career:'developer',skill:80,performance:90},
  {id:'work-hard',career:'developer',strategy:'hard',skillPractice:true},{id:'take-it-easy',career:'developer',strategy:'easy',skillPractice:true},
  {id:'reliable-normal',career:'developer',skillPractice:true},
  {id:'cafe-owner',career:'developer',ownedAssets:['cafe']},
  {id:'multiple-businesses',career:'developer',ownedAssets:['cafe','online_shop','micro_business']},
  {id:'unmanaged-business',career:'developer',ownedAssets:['cafe'],management:'none'},
  {id:'property-owner',career:'developer',ownedAssets:['cabin']},
  {id:'heavy-luxury',career:'barista',ownedAssets:['jet','yacht']},
  {id:'funded-starter',career:'barista',cash:6500},
  {id:'business-ladder',career:'developer',buyGoals:true,purchaseGoals:['micro_business','online_shop','cafe','duplex','commercial','hotel','yacht','island']},
  {id:'frequent-lateness',career:'developer',lateMinutes:45,skillPractice:true},
  {id:'missed-shifts',career:'developer',missEvery:3,skillPractice:true},
  {id:'high-skill-low-performance',career:'developer',skill:80,performance:10},
  {id:'low-skill-high-performance',career:'developer',skill:0,performance:90}
 ]
};
