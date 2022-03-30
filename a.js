var data = {
  block: [
    {
      type: "text",
      line: [
        { confidence: 1, word: [{ content: "当你无计可施时，就试试这个吧" }] },
        {
          confidence: 1,
          word: [{ content: "司华伯管理下的一家工厂，厂长无法使他管理的工" }],
        },
        {
          confidence: 1,
          word: [
            { content: "人完成标准化的生产量。司华伯问那个厂长：“这到底" },
          ],
        },
        {
          confidence: 1,
          word: [{ content: "是怎么回事……像你这样一个能干的人，竟不能使那些" }],
        },
        { confidence: 1, word: [{ content: "工人达到工厂预计的生产量？”" }] },
        {
          confidence: 1,
          word: [{ content: "厂长回答说：“我也弄不清楚是怎么回事……我用" }],
        },
        {
          confidence: 1,
          word: [
            { content: "温和的话鼓励他们，有时不得已去斥责他们，甚至用降" },
          ],
        },
        {
          confidence: 1,
          word: [{ content: "职、撤职来吓號他们，可是那些工人就是不肯辛勤工" }],
        },
        { confidence: 1, word: [{ content: "作。”" }] },
        {
          confidence: 1,
          word: [{ content: "他们谈话的时候，是日班快结束、夜班将开始之" }],
        },
        { confidence: 1, word: [{ content: "时。" }] },
        {
          confidence: 1,
          word: [{ content: "司华伯对厂长说：“你给我一支粉笔。”他拿了支粉" }],
        },
        {
          confidence: 1,
          word: [
            { content: "笔，走向近边的工人处，问其中一名工人：“你们这班今" },
          ],
        },
        {
          confidence: 1,
          word: [{ content: "天完成了几个单位？”那工人回答说：“6个。”" }],
        },
        {
          confidence: 1,
          word: [{ content: "司华伯听到这样，一字不说，就在地上写了一个大" }],
        },
        { confidence: 1, word: [{ content: "大的“6”字，便走了。" }] },
        {
          confidence: 1,
          word: [{ content: "夜班的工人来接班，看到这个“6”字，便问是什" }],
        },
        { confidence: 1, word: [{ content: "么意思。" }] },
        {
          confidence: 1,
          word: [{ content: "日班的工人说：“大老板刚才来这里，他问我们今" }],
        },
        { confidence: 1, word: [{ content: "第三章获取信服的12种方法" }] },
      ],
    },
  ],
};

function getText() {
  const arr = data.block.map((item) =>
    item.line.map((lineItem) =>
      lineItem.word.map((wordItem) => wordItem.content)
    )
  );
  return arr.join("\n");
}

console.log(getText());
