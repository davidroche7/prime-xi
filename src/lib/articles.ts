/** Long-form club history. Prose only: no rankings of players and no "best XI"
 *  claims, because those would leak the hidden canonical keys. */
export type Article = {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "how-liverpool-fc-began",
    title: "How Liverpool FC began: a rent dispute, an empty ground and a new club",
    description:
      "Liverpool FC exists because Everton walked out of Anfield in 1892. The story of John Houlding, the split, and the club's first decade.",
    sections: [
      {
        heading: "The club that started with a ground",
        paragraphs: [
          "Most football clubs begin with a team and go looking for somewhere to play. Liverpool began the other way round. In the spring of 1892 Anfield was a working football ground with stands, a pitch and a landlord, and it had just lost its tenants. The tenants were Everton.",
          "That detail still surprises people. Everton played at Anfield from 1884, won the Football League there in 1891, and were by some distance the leading club on Merseyside. The ground that became a global byword for Liverpool FC was built up by the club now based on the other side of Stanley Park.",
        ],
      },
      {
        heading: "John Houlding and the row over rent",
        paragraphs: [
          "The central figure is John Houlding, a brewer, local politician and later Lord Mayor of Liverpool. Houlding was Everton's president and also held the interest in the Anfield land. As Everton grew, so did the money passing through the arrangement, and the relationship between landlord and club soured. Members objected to the rent he wanted, and objected too to his plans for the ground and the way his interests overlapped with the club's.",
          "Football politics in the 1890s looks very familiar now. There was a fight over who a club really belonged to: the man who controlled its assets, or the members who turned up. The members won. In 1892 Everton left and moved to a new home at Goodison Park, taking the name, the league place and most of the team with them.",
        ],
      },
      {
        heading: "A new name in 1892",
        paragraphs: [
          "Houlding was left with a stadium and nobody to play in it. His answer was to found a new club. He tried to keep the name Everton, but the Football Association would not allow it, so the new organisation took the name of the city instead: Liverpool Football Club.",
          "It is worth pausing on how much that forced choice shaped things. A club born out of a dispute, named for a whole city rather than a district, went on to carry that city's name around the world.",
          "The new club needed players quickly, and it found many of them in Scotland. The side became known as the 'team of Macs' for the number of Scots in it. Its first season, 1892-93, was spent in the Lancashire League, which Liverpool won. Admission to the Football League's Second Division followed in 1893.",
        ],
      },
      {
        heading: "From the Second Division to champions",
        paragraphs: [
          "Liverpool went through the 1893-94 Second Division season unbeaten and won promotion through the test matches of the time. The early years were unsteady, with relegation and promotion both arriving quickly, but the appointment of Tom Watson in 1896 gave the club stability. Watson had already won league titles with Sunderland, and he was to stay in charge until his death in 1915.",
          "Under Watson, Liverpool became league champions for the first time in 1900-01, nine years after the club was formed. A second title followed in 1905-06, the season after another Second Division title. Few clubs founded so late have moved so quickly from nothing to the top of the English game.",
        ],
      },
      {
        heading: "The Kop arrives",
        paragraphs: [
          "The 1906 title brought one more lasting change. That year the club built a large banked terrace behind one goal, and it took the name Spion Kop after a hill in South Africa where many soldiers from Lancashire regiments had died during the Boer War in 1900. Several English grounds used the name, but Anfield's is the one that became famous.",
          "So within about fifteen years, the essential pieces were in place: the ground, the name, the city, the rivalry and the terrace. The rivalry deserves particular notice. Liverpool and Everton are often described as a friendly derby, and families across the city are divided between them. But the origin is a real split, and the two clubs have spent well over a century living with it, less than a mile apart.",
        ],
      },
      {
        heading: "Why the origin still matters",
        paragraphs: [
          "It is tempting to treat all this as trivia, the kind of thing that turns up as a quiz question. It is more than that. The events of 1892 explain why Anfield is a Liverpool ground with an Everton history, why two major clubs stand so close together, and why a club with no team could still inherit a great stage.",
          "Houlding died in 1902, a year after his club first became champions of England. He had not set out to create a rival to the club he had once led. He had set out to keep hold of a football ground. What came out of the argument was one of the most successful clubs the game has seen.",
        ],
      },
    ],
  },
  {
    slug: "bill-shankly-rebuilt-liverpool",
    title: "How Bill Shankly rebuilt Liverpool from the Second Division",
    description:
      "In December 1959 Liverpool were a Second Division club with a tired ground. Fifteen years later, Bill Shankly had turned them into champions of England and winners in Europe.",
    sections: [
      {
        heading: "What Shankly walked into",
        paragraphs: [
          "When Bill Shankly arrived from Huddersfield Town in December 1959, Liverpool were not a sleeping giant in any comfortable sense. They had been in the Second Division since 1954, and had come close to promotion several times without getting there. The training ground at Melwood was run down and Anfield itself needed work.",
          "Shankly was a former miner from the Scottish village of Glenbuck, a one-time Preston and Scotland wing-half, and a manager who had worked his way around smaller clubs without winning anything. Nothing on his record promised what came next. What he did have was an unusually complete belief in football as a way of life, and an ability to make others feel it.",
        ],
      },
      {
        heading: "The men he kept",
        paragraphs: [
          "The most important decision Shankly made may have been one he did not make. A new manager of the time might well have cleared out the existing staff. Shankly kept them. Bob Paisley, Joe Fagan and Reuben Bennett remained, and this group became the core of what came to be known as the Boot Room, named after a small room at Anfield where the coaches talked football.",
          "Shankly also reshaped the daily routine. Players changed at Anfield and took a bus to Melwood, then returned to Anfield to bathe and eat together, a habit meant to keep them loose and avoid injuries. The emphasis in training was on small-sided games, on pass and move, and on getting fit by playing rather than endless running. Simple as it sounds, it gave the club a shared football language.",
        ],
      },
      {
        heading: "Two signings and a promotion",
        paragraphs: [
          "The rebuild needed new players, and in 1961 the board finally backed him with serious money. Ian St John came from Motherwell, and Ron Yeats from Dundee United. Shankly's famous sales pitch for Yeats, inviting journalists to walk around him, became part of the legend. More to the point, the pair gave the side a cutting edge and a spine.",
          "The effect was immediate. Liverpool won the Second Division in 1961-62, and returned to the top flight after eight years away. A club which had been treading water for most of a decade had moved within two and a half years of his arrival.",
        ],
      },
      {
        heading: "Champions, and the first FA Cup",
        paragraphs: [
          "Promotion was only the start. Liverpool were league champions in 1963-64, two seasons after going up, and that same year the Kop's singing, including its adoption of Gerry and the Pacemakers' You'll Never Walk Alone, began attracting national attention.",
          "In 1965 came a landmark. Liverpool had never won the FA Cup, a fact their rivals enjoyed mentioning. At Wembley they beat Leeds United 2-1 after extra time, with Roger Hunt and Ian St John scoring. Days later, Anfield staged a European Cup semi-final first leg against Inter Milan, and Liverpool won 3-1, parading the cup before kick-off. The tie was lost in a bitter second leg in Milan, but the night became part of Anfield folklore. A second league title followed in 1965-66, along with a European Cup Winners' Cup final, lost to Borussia Dortmund at Hampden Park.",
        ],
      },
      {
        heading: "Building a second great side",
        paragraphs: [
          "By the end of the 1960s that team was ageing. A defeat at Watford in the 1970 FA Cup is often seen as the moment Shankly accepted that it had to change. Doing that well is harder than building the first time, and many great managers have failed at it. Shankly managed it. Ray Clemence was already at the club, Kevin Keegan arrived from Scunthorpe United in 1971, and John Toshack came from Cardiff City.",
          "The second side won the league in 1972-73 and the UEFA Cup in the same season, beating Borussia Mönchengladbach 3-2 on aggregate: the club's first European trophy, and a first English double of league and European trophy. In 1974 Liverpool took the FA Cup too, beating Newcastle United 3-0 at Wembley with a performance that remains among the best in any final at the old stadium.",
        ],
      },
      {
        heading: "The resignation nobody expected",
        paragraphs: [
          "Then, in July 1974, Shankly resigned. The club and the city were stunned. He said he was tired, and that his wife Nessie deserved more of his time. He later seemed to regret the decision, and his relationship with the club after retirement could be awkward, not least when he turned up at Melwood and players still called him 'Boss'.",
          "He died in 1981. By then the staff he had kept were winning European Cups, which is perhaps the truest measure of what he did. Shankly won three league titles, two FA Cups and a UEFA Cup, but his larger achievement was a system that carried on after he had gone. The club did not depend on one man, however much that man might have seemed to embody it.",
        ],
      },
    ],
  },
  {
    slug: "bob-paisley-quiet-revolution",
    title: "Bob Paisley: the reluctant manager who won three European Cups",
    description:
      "Bob Paisley never wanted the Liverpool job. Nine seasons later he had won six league titles and three European Cups. How the quietest man in the Boot Room did it.",
    sections: [
      {
        heading: "The man who did not want the job",
        paragraphs: [
          "When Bill Shankly resigned in 1974, the natural choice to succeed him did not want the post. Bob Paisley was 55. He had joined Liverpool as a player in 1939, stayed through the war years, won a league title in 1947 and then spent decades as a physio and coach. He told the players he had not sought the job and was only doing it to keep things going until someone else could be found.",
          "Paisley was from Hetton-le-Hole in County Durham, spoke in a low, mumbling way and was no one's idea of a showman. Following Shankly, the greatest talker in English football, looked an impossible assignment. His first season ended without a trophy, which some took as confirmation. It was the only season of the sort for quite some time.",
        ],
      },
      {
        heading: "An eye for what others missed",
        paragraphs: [
          "Paisley's great gift was seeing what a player could become. His long years treating injuries had taught him to read how bodies moved, and he could often spot an injury or a weakness from the way somebody walked. He saw things in footballers that nobody else had.",
          "The clearest case is Ray Kennedy, signed by Shankly from Arsenal as a striker. Paisley moved him to the left of midfield, and Kennedy became one of the most effective players of the era in that role. Another was Phil Neal, signed from Northampton Town in 1974 as Paisley's first purchase, who became one of the most decorated full-backs in English history. Terry McDermott, Jimmy Case and Phil Thompson all developed under him, and the later signings of Alan Hansen, Kenny Dalglish, Graeme Souness and Ian Rush brought the side new dimensions.",
        ],
      },
      {
        heading: "The first European Cup",
        paragraphs: [
          "Liverpool won the league and the UEFA Cup in 1975-76, beating Club Brugge 4-3 on aggregate, then retained the league in 1976-77. That season brought them close to an unprecedented treble. Manchester United beat them 2-1 in the FA Cup final, which might have broken a lesser group. Four days later, in Rome, Liverpool played Borussia Mönchengladbach in the European Cup final.",
          "Terry McDermott, Tommy Smith and a Phil Neal penalty gave Liverpool a 3-1 win. Smith, a veteran who had been expected to retire, scored with a header. It was the first time the club had won the trophy, and Kevin Keegan's final game before leaving for Hamburg.",
        ],
      },
      {
        heading: "Keegan leaves, and the side improves",
        paragraphs: [
          "Losing Keegan should have been a blow. Paisley replaced him with Kenny Dalglish from Celtic in 1977, and the team became better. Liverpool retained the European Cup in 1978, beating Club Brugge 1-0 at Wembley, with Dalglish scoring from a Graeme Souness pass. Dalglish, Souness and Alan Hansen were all Scots who arrived within a short time of each other, and all would shape the club for a decade.",
          "The 1978-79 league side was perhaps Paisley's most impressive. It conceded only 16 league goals across a 42-game season, a record at the time. Another title followed in 1979-80.",
        ],
      },
      {
        heading: "Paris, 1981",
        paragraphs: [
          "The third European Cup came in an unexpected year. Liverpool finished only fifth in the league in 1980-81, but in the final in Paris they met Real Madrid and won 1-0. Alan Kennedy, the left-back, scored the only goal after surging forward late on. They also won the League Cup that season, the club's first, and they went on to win it three years running.",
          "That made Paisley the first manager to win the European Cup three times. Only a handful of managers have since matched it. All this from a man who had spent his career insisting that he would rather be in the background.",
        ],
      },
      {
        heading: "Stepping aside on his own terms",
        paragraphs: [
          "Paisley's final seasons added two further league titles in 1981-82 and 1982-83, and he retired in 1983 after nine seasons. In total he had won six league titles, three European Cups, a UEFA Cup and three League Cups. The FA Cup, oddly, always escaped him.",
          "He also left the club in good order. The team that he passed on to Joe Fagan went on to win three trophies in the very next season. Paisley never claimed the credit in the manner of a modern manager, and his reticence meant that he has sometimes been remembered as less of a figure than his predecessor. The record suggests no such thing. He died in 1996, having been possibly the most successful English manager there has ever been.",
        ],
      },
    ],
  },
  {
    slug: "joe-fagan-1984-treble",
    title: "Joe Fagan and the 1984 treble: Liverpool's greatest forgotten season",
    description:
      "In his first season as manager, 63-year-old Joe Fagan won the league, the League Cup and the European Cup. The story of Liverpool's 1983-84 treble.",
    sections: [
      {
        heading: "The third man of the Boot Room",
        paragraphs: [
          "Joe Fagan was 62 when he took over from Bob Paisley in the summer of 1983. He had been at Liverpool since 1958, having arrived under Phil Taylor before Shankly did, and had worked in almost every coaching role the club had. Like Paisley before him, he took the job out of duty as much as ambition. His promotion continued a line of succession that no other big club in Europe could have matched.",
          "He inherited a champion team, but also a difficult task. Paisley was the most decorated manager in English history. Fagan's answer was to change very little. He kept the routine, trusted senior players and offered quiet humanity. Graeme Souness, then captain, would later speak warmly about how Fagan managed men.",
        ],
      },
      {
        heading: "An all-Merseyside final",
        paragraphs: [
          "The first trophy of the season was the League Cup, then sponsored by the Milk Marketing Board. Liverpool's road to the final was hard going, with replays against several clubs, and the final itself was a historic occasion: the first all-Merseyside final at Wembley, against Everton in March 1984.",
          "It ended 0-0 after extra time, with supporters of both clubs mingling happily and chanting 'Merseyside' together. The replay at Maine Road was settled by one goal, a turning shot by Souness. It was Liverpool's fourth League Cup in a row.",
        ],
      },
      {
        heading: "Rush's astonishing season",
        paragraphs: [
          "In the league, the race was with Southampton, Nottingham Forest and Manchester United. Liverpool were not the dazzling side of 1979, and there were stretches when they ground out results. What they had was Ian Rush, then in one of the great individual seasons in English football.",
          "Rush scored 47 goals in all competitions, including 32 in the league, and won the European Golden Boot. His work without the ball was as important: he led the press from the front long before the word was common in English football. Kenny Dalglish, by then dropping deeper, fed him constantly. Liverpool finished as champions, the club's third title in a row and its 15th overall.",
        ],
      },
      {
        heading: "Into Rome",
        paragraphs: [
          "The European Cup campaign provided the season's most testing nights. Liverpool eliminated Benfica with a 4-1 win in Lisbon and Dinamo Bucharest in a fierce semi-final. The final was then given a further twist: it was to be played at the Stadio Olimpico in Rome, the home ground of their opponents, AS Roma.",
          "It would be hard to imagine a less neutral setting. Liverpool's players, by many accounts, kept themselves relaxed by singing a Chris Rea song in the tunnel, to the bemusement of the Italians. Phil Neal, the only survivor from the 1977 final side, gave Liverpool the lead. Roberto Pruzzo equalised before half-time, and it stayed 1-1 through extra time.",
        ],
      },
      {
        heading: "The wobbly legs",
        paragraphs: [
          "The shoot-out, the first to decide a European Cup final, has become one of the club's great images. Steve Nicol missed Liverpool's first penalty. Neal, Souness and Rush scored, and Roma's Bruno Conti put his kick over the bar. Then Bruce Grobbelaar, walking along his line, wobbled his legs in mock terror in front of Francesco Graziani, who also shot over.",
          "That left Alan Kennedy, the left-back who had won the 1981 final, to take the decisive kick. He was not known as a penalty taker. He sent the goalkeeper the wrong way, and Liverpool had won the European Cup for a fourth time. With the league and League Cup already secured, they had become the first English club to win three major trophies in a single season.",
        ],
      },
      {
        heading: "Why it gets overlooked",
        paragraphs: [
          "Fagan's treble does not receive the attention of other great seasons, and part of the explanation is that he lasted just two years. His second season ended with the 1985 European Cup final in Brussels, where 39 people, most of them Juventus supporters, died at the Heysel Stadium before the match. He stepped down as planned, and the images of him returning home in distress are hard to look at. English clubs were then banned from Europe.",
          "Football memory tends to attach itself to dynasties, and Fagan does not fit neatly into one, wedged between Paisley and Dalglish. Yet he did something none of his predecessors managed. In his first season as Liverpool manager, at the age of 63 by its end, he won everything he realistically could have. He died in 2001. There are few better examples of what the Boot Room stood for: no fuss, no self-promotion and an ordinary man's decency alongside extraordinary results.",
        ],
      },
    ],
  },
  {
    slug: "kenny-dalglish-1986-double",
    title: "Kenny Dalglish and the 1986 double: player-manager in his first season",
    description:
      "Liverpool's 1985-86 double was won by a rookie manager who was also picking himself. How Kenny Dalglish beat Everton to both league and FA Cup.",
    sections: [
      {
        heading: "An unexpected appointment",
        paragraphs: [
          "When Joe Fagan stepped down in 1985, Liverpool had reasons to look for continuity and for a clean start. The Heysel disaster had happened that May, English clubs had been banned from European competition, and the club was in shock. Its choice surprised almost everyone. Kenny Dalglish, 34 years old and still a player, would take over as player-manager.",
          "Dalglish had no coaching background, though he had been in the dressing room with people who understood the club deeply. Bob Paisley agreed to be on hand as an adviser. For all the romance of the idea, it was a risk. The team was ageing, Everton were reigning champions, and Dalglish was being asked to manage players who had been his friends and teammates for years.",
        ],
      },
      {
        heading: "Picking himself",
        paragraphs: [
          "Being a player-manager poses a particular problem: who decides that the manager is not playing well? Dalglish began by selecting himself less often, and his appearances through the middle of the season were limited. Liverpool were chasing for much of the campaign. Everton led comfortably at times, and Manchester United had started the season with ten straight wins.",
          "Around January, Liverpool's prospects looked poor. Defeat by Everton at Anfield in February left them well adrift, and a sense grew that the title was heading across Stanley Park. Dalglish then took a decision that changed the season: he restored himself to the side. Jan Mølby, the Danish midfielder, was at the height of his powers as a passer, Ronnie Whelan was excellent and Steve McMahon had arrived from Aston Villa to add bite.",
        ],
      },
      {
        heading: "The run",
        paragraphs: [
          "From late February, Liverpool went on a remarkable run, winning 11 of their last 12 league games and drawing the other. Ian Rush scored regularly and the defence, marshalled by Alan Hansen, grew steadily more solid. Everton slipped at the critical moment, with a defeat at Oxford United particularly costly.",
          "The title came at Stamford Bridge in Liverpool's last league game of the season. Liverpool needed to win against Chelsea, and the only goal was scored by Dalglish himself, controlling a pass on his chest and finishing with his right foot. It is hard to think of a neater ending: the manager, picking himself, clinching the league in his first season in charge.",
        ],
      },
      {
        heading: "The first all-Merseyside FA Cup final",
        paragraphs: [
          "A week later Liverpool and Everton met at Wembley, the first time the two clubs had faced each other in an FA Cup final. Everton had finished second in the league and could still take something out of the season. Gary Lineker put them ahead in the first half, and for long stretches of the game they looked the better side.",
          "Liverpool's recovery was led by Rush, who equalised after a pass from Mølby. Craig Johnston then put Liverpool ahead, and Rush added a third to make it 3-1. It gave Liverpool the double, only the third in the twentieth century after Tottenham Hotspur and Arsenal, and made Dalglish the first player-manager to achieve it.",
          "The sporting detail most people recall is the two sets of supporters travelling together and sharing Wembley. Coming only a year after Heysel, the occasion carried more than the usual meaning.",
        ],
      },
      {
        heading: "What came afterwards",
        paragraphs: [
          "Dalglish went on to win the league again in 1987-88, with a new attacking team built around John Barnes, Peter Beardsley and John Aldridge, one of the most exciting sides Liverpool have fielded. He won the FA Cup in 1989 and a further league title in 1989-90.",
          "The 1989 FA Cup run took place in the shadow of the Hillsborough disaster, in which 97 Liverpool supporters were unlawfully killed at an FA Cup semi-final that April. Dalglish and his wife Marina attended funerals and supported bereaved families, and his conduct in those weeks is remembered in the city at least as much as anything he did in football. The toll on him was very great. He resigned in February 1991, saying that he could no longer cope with the pressure of the job.",
        ],
      },
      {
        heading: "An unrepeatable season",
        paragraphs: [
          "No Liverpool manager has since started a job as Dalglish did. Modern football would be very unlikely to hand a leading club to an active player without experience, and the role of player-manager has largely vanished from the top level. The 1986 double therefore belongs to a world that no longer exists.",
          "It also shows how the club's succession was meant to work. Dalglish had absorbed from Shankly's and Paisley's teams a way of doing things, and Paisley was literally at his side. He brought his own personality, but the instincts were inherited: back the senior players, keep the routine, and trust football intelligence. In that respect, the most unusual appointment in the club's history was also among its most traditional.",
        ],
      },
    ],
  },
  {
    slug: "gerard-houllier-2001-cup-treble",
    title: "Gérard Houllier's 2001 cup treble: three finals in one extraordinary season",
    description:
      "In 2000-01, Liverpool won the League Cup, the FA Cup and the UEFA Cup. A look back at the season when Gérard Houllier brought trophies back to Anfield.",
    sections: [
      {
        heading: "The club Houllier inherited",
        paragraphs: [
          "By the late 1990s, Liverpool's standing had changed. The league title had last been won in 1990, and the team under Roy Evans, attractive though it could be, had a reputation for a lack of steel. In 1998 the board tried a joint arrangement, placing Evans alongside Gérard Houllier, the former France national team manager. It failed within months, and Evans left in November 1998, leaving Houllier in sole charge.",
          "Houllier set about changing the culture. He raised standards of diet, discipline and professional behaviour, and moved on several established players. He also signed strongly. Sami Hyypiä and Dietmar Hamann brought defensive order and Stéphane Henchoz arrived to partner Hyypiä. With Steven Gerrard, Michael Owen, Jamie Carragher and Robbie Fowler coming through or already in place, the side had a young core.",
        ],
      },
      {
        heading: "A squad built for cup football",
        paragraphs: [
          "By 2000-01 this was a team with a distinct character: organised, physically strong and dangerous on the counter-attack. Gary McAllister, signed on a free transfer at the age of 35, added experience, and proved one of the shrewdest bits of business of the period. Few expected him to have the impact he did, least of all in the spring of that season.",
          "Liverpool would end up playing 63 competitive matches in that campaign. That sort of workload called for rotation at a time when it was less common among English clubs, and Houllier's willingness to use his squad became central to the story.",
        ],
      },
      {
        heading: "Cardiff, part one: the League Cup",
        paragraphs: [
          "The first trophy came in February 2001, in a League Cup final against Birmingham City at the Millennium Stadium, with Wembley being rebuilt. Robbie Fowler scored a wonderful long-range goal, but a late penalty brought Birmingham level. After extra time, Liverpool won the shoot-out. It was the club's first trophy in six years, and it took some of the pressure away.",
        ],
      },
      {
        heading: "Cardiff, part two: Owen's FA Cup final",
        paragraphs: [
          "If the League Cup was a relief, the FA Cup final in May was a heist. Arsenal were the better side for much of the afternoon at Cardiff, and took the lead through Freddie Ljungberg in the 72nd minute. Stéphane Henchoz had got away with a handball on the line in the first half that might have changed the entire game.",
          "Then Michael Owen took over. He equalised in the 83rd minute, and five minutes later chased a long ball from Patrik Berger, beat Lee Dixon and Tony Adams for pace and finished with his left foot across David Seaman. It was over in moments. Ask any Liverpool supporter of that age, and they can usually tell you where they were.",
        ],
      },
      {
        heading: "Dortmund: the 5-4",
        paragraphs: [
          "Four days later, Liverpool played Alavés in the UEFA Cup final in Dortmund. The Spanish club had never reached a European final, and had needed a run of big results to get there. On the road Liverpool had eliminated Roma, Porto and Barcelona, showing plenty of tactical discipline.",
          "What followed was one of the most entertaining finals ever played. Markus Babbel and Gerrard put Liverpool two up inside 16 minutes. Alavés scored, then Owen was fouled and McAllister converted the penalty, so it was 3-1 at half-time. Alavés then scored twice just after the break to make it 3-3. Fowler, on as a substitute, put Liverpool ahead with a brilliant goal, then Jordi Cruyff equalised with a late header for 4-4.",
          "The game went to extra time under the golden goal rule, and Alavés ended with nine men. With the match approaching penalties, McAllister swung in a free-kick from the right and Delfí Geli, under pressure, headed it into his own net. Liverpool had won 5-4.",
        ],
      },
      {
        heading: "An unusual legacy",
        paragraphs: [
          "The season also ended with a third-place league finish, bringing a return to the Champions League for the first time in its modern form. Liverpool then won the Charity Shield and the European Super Cup in August 2001. Taken as a whole, it was a marvellous run for a club that had been drifting only a few years before.",
          "Debate continues about whether it should be called a treble, since it does not include the league or European Cup. The sensible answer is to describe it precisely: a cup treble, won in three finals in less than four months. Houllier's later years in charge were more complicated. He suffered a serious heart problem in October 2001, and the side faded after finishing second in 2002. But Liverpool's revival had started with him, and much of the team that won in Istanbul four years later included his players. He died in 2020.",
        ],
      },
    ],
  },
  {
    slug: "istanbul-2005",
    title: "Istanbul 2005: how Liverpool came back from 3-0 down against Milan",
    description:
      "Three goals down at half-time in the Champions League final, Liverpool scored three times in six minutes and won on penalties. The story of Istanbul.",
    sections: [
      {
        heading: "A team that should not have been there",
        paragraphs: [
          "Liverpool's fifth European Cup should really be understood through the unlikely way they reached the final. Rafael Benítez had arrived from Valencia in the summer of 2004, replacing Gérard Houllier. The domestic season that followed was poor: they finished fifth in the Premier League, 37 points behind champions Chelsea.",
          "They nearly went out in the group stage. Liverpool needed to beat Olympiacos by two clear goals at Anfield in December, and went behind. Florent Sinama Pongolle equalised, Neil Mellor made it 2-1, and with four minutes left Steven Gerrard struck a volley from outside the area that remains one of the most celebrated goals at Anfield.",
          "The knock-out stages brought wins over Bayer Leverkusen, Juventus and then Chelsea. Against Chelsea, the semi-final was settled at Anfield by a Luis García goal that Chelsea's manager José Mourinho would go on calling a 'ghost goal'. Liverpool had reached their first European Cup final since 1985.",
        ],
      },
      {
        heading: "The first half",
        paragraphs: [
          "Their opponents in Istanbul, on 25 May 2005, were AC Milan, arguably the finest club side in Europe. Their lineup included Paolo Maldini, Alessandro Nesta, Andrea Pirlo, Kaká, Andriy Shevchenko and Hernán Crespo. Benítez picked Harry Kewell ahead of Dietmar Hamann, a decision he would soon reverse.",
          "Maldini scored inside a minute, the oldest player to score in a European Cup final. Liverpool were then undone by Kaká's passing, with Crespo scoring twice before half-time. Kewell left injured, Vladimir Šmicer came on, and at 3-0 down the final appeared to be over. Liverpool had been outclassed. Thousands of supporters stayed in the stands of the Atatürk Olympic Stadium and sang You'll Never Walk Alone in the interval anyway.",
        ],
      },
      {
        heading: "Six minutes",
        paragraphs: [
          "Benítez made a key change at half-time, bringing on Hamann for Steve Finnan and moving to a three-man defence. It stopped Kaká having so much room and gave Xabi Alonso and Gerrard more freedom further up.",
          "Gerrard started it in the 54th minute, heading in a cross from John Arne Riise and urging the crowd on as he ran back. Two minutes later Šmicer shot low from distance past Dida. In the 60th minute Gerrard was brought down in the box by Gennaro Gattuso. Alonso's penalty was saved by Dida, but he scored from the rebound. Three goals in six minutes had turned a rout into a final that was level.",
        ],
      },
      {
        heading: "Holding on",
        paragraphs: [
          "The remaining hour was in some ways more extraordinary still. Milan recovered and took control, and Liverpool were exhausted, with Gerrard moved to right-back to deal with Serginho. Jamie Carragher, suffering cramp, threw himself at everything in defence.",
          "In the last minutes of extra time came the save for which Jerzy Dudek will always be remembered. Shevchenko had a header from close in saved, then had the rebound from a yard or so out, and Dudek somehow got a hand to that as well. It remains very difficult to explain how it stayed out.",
        ],
      },
      {
        heading: "The penalties",
        paragraphs: [
          "Before the shoot-out, Carragher went over to Dudek and told him to do what Bruce Grobbelaar had done in Rome. Dudek, wobbling and dancing along his line, was effective. Serginho blazed over. Hamann, playing on with a broken toe, scored. Dudek saved from Pirlo. Djibril Cissé converted. Jon Dahl Tomasson scored for Milan, and Riise had his effort saved. Kaká scored, then Šmicer in his last match for the club scored too.",
          "That left Shevchenko needing to score to keep Milan alive. His kick went down the middle, and Dudek stopped it. Liverpool had won 3-2 on penalties after a 3-3 draw, and Gerrard lifted the trophy, which the club kept permanently under the rules of the time after a fifth success.",
        ],
      },
      {
        heading: "What it meant",
        paragraphs: [
          "It is often described as the greatest of all European finals, and it's difficult to make a strong argument against that. More than the comeback itself, Istanbul endures because of how little sense it made. A team that finished fifth at home beat one of the best sides of the modern era after trailing by three goals at half-time in the biggest match in club football.",
          "Two years later the two teams met again in Athens, and Milan took their revenge, winning 2-1. It did little to dull the memory of 2005. For Liverpool supporters, the word 'Istanbul' has no need of further explanation.",
        ],
      },
    ],
  },
  {
    slug: "klopp-30-year-wait",
    title: "Madrid, then the title: how Jürgen Klopp ended Liverpool's 30-year wait",
    description:
      "Between June 2019 and June 2020, Liverpool won the Champions League and their first league title since 1990. How Jürgen Klopp's team got there.",
    sections: [
      {
        heading: "From doubters to believers",
        paragraphs: [
          "When Jürgen Klopp arrived in October 2015, replacing Brendan Rodgers, Liverpool had not won the league since 1990. The nearest they had come in the Premier League era was second place in 2001-02, 2008-09 and 2013-14, the last when Steven Gerrard's slip against Chelsea became a painful symbol of the wait. Klopp, who had won two Bundesliga titles with Borussia Dortmund, spoke at his first press conference of turning doubters into believers.",
          "He lost his first three finals in charge of the club: the League Cup final and the Europa League final in 2016, then the Champions League final in 2018 against Real Madrid in Kyiv. That last one was particularly cruel, with Mohamed Salah going off injured and goalkeeper Loris Karius making two errors.",
        ],
      },
      {
        heading: "The recruitment",
        paragraphs: [
          "Behind the results sat a remarkable period in the transfer market, with Michael Edwards as sporting director and an analytics team that shaped the club's thinking. Sadio Mané came from Southampton in 2016, Salah from Roma in 2017, and Andrew Robertson from relegated Hull City for £8m. Roberto Firmino, already at the club, was remodelled into a selfless forward. Trent Alexander-Arnold came through the academy.",
          "Then the final pieces arrived. Virgil van Dijk joined from Southampton in January 2018 for a world-record fee for a defender at around £75m, and Alisson Becker came from Roma that summer at a world-record fee for a goalkeeper. With the pair in place, the defence became one of the best in Europe almost overnight.",
        ],
      },
      {
        heading: "97 points, and second place",
        paragraphs: [
          "In 2018-19, Liverpool collected 97 Premier League points and lost only one league game. In almost any other year in history it would have been enough. Manchester City finished on 98. Doing everything right and still losing the title might have knocked the belief out of most sides.",
        ],
      },
      {
        heading: "Corner taken quickly",
        paragraphs: [
          "That season's Champions League, though, produced the night by which this team will probably be remembered. In May 2019 Liverpool lost the semi-final first leg 3-0 at Barcelona, and went into the return without Salah and Firmino. Divock Origi scored early. Georginio Wijnaldum came on at half-time for Robertson and scored twice in two minutes, and it was 3-3 on aggregate.",
          "Then came a moment of pure invention. With Barcelona's defenders switched off, 20-year-old Alexander-Arnold, who had begun to walk away from a corner, turned back and whipped it quickly in to Origi, who finished. Anfield, which has seen a great many European nights, had rarely known anything like it.",
          "The final, in Madrid on 1 June against Tottenham Hotspur, was less memorable as a game. Salah scored an early penalty, and Origi added a second late on to win it 2-0. The European Cup had come back to Liverpool for a sixth time, and it broke Klopp's sequence of lost finals.",
        ],
      },
      {
        heading: "A title decided in an empty football world",
        paragraphs: [
          "Liverpool responded to the near-miss in the league by producing one of the most dominant seasons in English history. They won 26 and drew one of their first 27 league games of 2019-20, and by late February had opened a lead of 22 points. It looked set to be the earliest title win ever.",
          "Then the Covid-19 pandemic stopped football in March, and for some weeks there was serious talk of whether the season would finish at all. The irony for a club which had waited three decades was hard to miss. Play resumed in June behind closed doors, and on 25 June Chelsea beat Manchester City, leaving Liverpool champions with seven games to play. It was the first time a team had won the Premier League with so many games left.",
        ],
      },
      {
        heading: "The wait, and how it ended",
        paragraphs: [
          "The trophy was lifted by Jordan Henderson on a specially built stand on the Kop, in an empty stadium. Liverpool ended up with 99 points. Thousands gathered outside Anfield even though the players could not be seen, and for those who had waited since 1990 the moment was both joyful and oddly muted.",
          "Klopp went on to win the FA Cup and League Cup in 2022, and another League Cup in 2024, his final season, leaving after nearly nine years. What his teams did in that twelve-month stretch is best seen as a return to the club's older pattern: a coherent approach, an intelligent backroom and a manager who could make supporters feel part of the project. The Boot Room had gone, but something of the idea had come back.",
        ],
      },
    ],
  },
];

export function wordCount(a: Article): number {
  return a.sections.flatMap((s) => s.paragraphs).join(" ").split(/\s+/).length;
}
