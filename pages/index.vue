<template>
  <div>
    <!-- <link rel="stylesheet" href="/font.css" />
    <link rel="stylesheet" href="/main.css" /> -->

    <div class="outercontainer">
      <Header />
      <div class="container body">
        <div class="content heading anchor" id="home">
          <div class="img">
            <img class="img_responsive" src="/assets/HaoYin.jpg" alt="Photo" />
          </div>

          <div class="text info">
            <h1>Hao Yin</h1>
            <p></p>
            <div>Assistant Professor</div>
            <div>Computer Science Department</div>
            <div>Stanford University</div>
            <div>Email:&nbsp;jiajunwu [at] cs (dot) stanford (dot) edu</div>
            <p>
              <span
                ><a
                  href="https://scholar.google.com/citations?user=2efgcS0AAAAJ&amp;hl=en&amp;oi=ao"
                  >Google Scholar</a
                ></span
              >
              /
              <span
                ><a href="http://dblp.dagstuhl.de/pers/hd/w/Wu_0001:Jiajun"
                  >DBLP</a
                ></span
              >
              /
              <span
                ><a href="https://profiles.stanford.edu/jiajun-wu"
                  >Stanford Profiles</a
                ></span
              >
            </p>
            <p></p>
          </div>

          <div class="text topic">
            <p></p>
            <div class="title">Current Research Topics</div>
            <ul>
              <li>
                <a href="#phys" onclick="showPubs(2)"
                  >Physical Scene Understanding</a
                >
              </li>
              <li>
                <a href="#robot" onclick="showPubs(2)">Dynamics Models</a>
              </li>
              <li>
                <a href="#reason" onclick="showPubs(2)"
                  >Neuro-Symbolic Visual Reasoning</a
                >
              </li>
              <li>
                <a href="#gen" onclick="showPubs(2)"
                  >Generative Visual Models</a
                >
              </li>
              <li>
                <a href="#multi" onclick="showPubs(2)"
                  >Multi-Modal Perception</a
                >
              </li>
            </ul>
            <p></p>
          </div>

          <div class="text">
            <p>
              I am an Assistant Professor of
              <a href="https://cs.stanford.edu/">Computer Science</a> at
              <a href="https://www.stanford.edu/">Stanford University</a>,
              affiliated with the
              <a href="http://svl.stanford.edu/"
                >Stanford Vision and Learning Lab (SVL)</a
              >
              and the
              <a href="https://ai.stanford.edu/">Stanford AI Lab (SAIL)</a>. I
              study machine perception, reasoning, and interaction with the
              physical world, drawing inspiration from human cognition.

              <a href="javascript:showRecruit()"
                >Here is some information for
                <span class="highlight">prospective students and visitors</span
                >.</a
              >
            </p>

            <div class="recruit" id="recruit">
              <p>
                Thank you for your interest in joining my group! Due to the
                large number of emails I receive, I cannot respond to every
                email individually. Please review the information below before
                contacting me. Thanks.
              </p>

              <p>
                <span class="highlight">Current Stanford students</span>: please
                fill out
                <a href="https://forms.gle/TuCU51tLBpZimyCB8">this form</a>. For
                MS students and undergraduates, the minimum time commitment is
                15 hours per week for six months.
              </p>

              <p>
                <span class="highlight"
                  >Prospective postdocs and visiting graduate students</span
                >: please email me directly with your CV. For visiting graduate
                students, the minimum length of a research visit is six months.
              </p>

              <p>
                <span class="highlight"
                  >Prospective graduate students who are not currently at
                  Stanford</span
                >: please apply through the system and list me as a potential
                advisor in your application. There is no need to contact me,
                unless you have a particular research question/idea that you
                would like to discuss further. If you email me, please describe
                the research question concretely, and include your CV,
                transcript, and no more than one published paper.
              </p>
            </div>

            <p>
              Before joining Stanford, I was a Visiting Faculty Researcher at
              <a href="https://ai.google/">Google Research, New York City</a>,
              working with
              <a href="http://www.cs.cornell.edu/~snavely/">Noah Snavely</a>. I
              finished my PhD at MIT, advised by
              <a href="http://billf.mit.edu/">Bill Freeman</a> and
              <a href="http://web.mit.edu/cocosci/josh.html">Josh Tenenbaum</a>,
              and my undergraduate degrees at Tsinghua University, working with
              <span class="author"
                ><a href="http://pages.ucsd.edu/~ztu/">Zhuowen Tu</a></span
              >.
            </p>
          </div>
        </div>

        <!--        
        <div class="content news">
          <div class="text front">
            <h3>News</h3>
            <ul>
              <li>I co-organized the <a href="http://mindsvsmachines.com/">Minds vs. Machines</a> workshop, 
                the <a href="http://sightsound.org">Sight and Sound</a> workshop, 
                the <a href="https://scene-understanding.com/">3D Scene Understanding</a> workshop, 
                and the <a href="http://nscv.csail.mit.edu/">Neuro-Symbolic Visual Reasoning and Program Synthesis</a> tutorial at CVPR 2020.
                I also gave an invited talk at the Learning 3D Generative Models workshop (<a href="https://www.youtube.com/watch?v=g7U7aarMHU0">video</a>).</li>
            </ul>
          </div>
        </div>
-->
        <div class="content talk anchor" id="talks">
          <div class="text front webgl-list">
            <h3>Visualizations</h3>
            <a
              target="_blank"
              v-for="item in webglList"
              :key="item.title"
              :href="'/paper-detail?paper=' + item.file"
            >
              {{ item.title }}
              <img :src="'/webgl/img/' + item.img" />
            </a>
          </div>
        </div>

        <div class="content teaching anchor" id="teaching">
          <div class="text front">
            <h3>Teaching</h3>
            <ul>
              <li>
                SYMSYS1/SYMSYS200/CS24/LINGUIST35/PHIL99/PSYCH35: Minds and
                Machines, Fall 2022 (with
                <a href="https://web.stanford.edu/~icard/">Thomas Icard</a>)
              </li>
              <li>
                <a href="http://cs231n.stanford.edu/"
                  >CS231N: Deep Learning for Computer Vision, Spring 2022</a
                >
                (with
                <a href="https://profiles.stanford.edu/fei-fei-li"
                  >Fei-Fei Li</a
                >
                and <a href="https://ai.stanford.edu/~rhgao/">Ruohan Gao</a>)
              </li>
              <li>
                <a href="https://cs322.stanford.edu/"
                  >PSYCH225/CS322: Triangulating Intelligence: Melding
                  Neuroscience, Psychology, and AI, Winter 2022</a
                >
                (with
                <a href="http://web.stanford.edu/~hyo/Home.html">Hyo Gweon</a>
                and <a href="https://web.stanford.edu/~yamins/">Dan Yamins</a>)
              </li>
              <li>
                <a href="http://cs348i.stanford.edu/"
                  >CS348I: Computer Graphics in the Era of AI, Fall 2021, Fall
                  2020</a
                >
                (with
                <a href="https://tml.stanford.edu/people/karen-liu">Karen Liu</a
                >)
              </li>
              <li>
                <a href="https://stanford-cs221.github.io/winter2021/"
                  >CS221: Artificial Intelligence: Principles and Techniques,
                  Winter 2021</a
                >
                (with <a href="https://thashim.github.io/">Tatsu Hashimoto</a>)
              </li>
              <li>
                <a href="http://vision.stanford.edu/teaching/cs131_fall2021/"
                  >CS131: Computer Vision: Foundations and Applications, Fall
                  2020</a
                >
                (with <a href="http://www.niebles.net/">Juan Carlos Niebles</a>)
              </li>
            </ul>
          </div>
        </div>

        <div class="content talk anchor" id="talks">
          <div class="text front">
            <h3>Talks</h3>
            <span v-for="item in talkList" :key="item.title">
              <a
                v-if="item.type === 'pdf'"
                target="_blank"
                :href="'/pdf/' + item.file + '.pdf'"
              >
                {{ item.title }}
                <img :src="item.img" />
              </a>
              <a
                v-else
                target="_blank"
                :href="'/paper-detail?paper=' + item.file"
              >
                {{ item.title }}
                <img :src="item.img" />
              </a>
            </span>
          </div>
        </div>

        <div class="content anchor" id="publications">
          <div class="text front">
            <h3>
              Publications (
              <a
                href=""
                id="select0"
                onclick="showPubs(0); return false;"
                style="text-decoration: underline; color: rgb(0, 0, 0)"
                >show selected</a
              >
              /
              <a
                href=""
                id="select1"
                onclick="showPubs(1); return false;"
                style=""
                >show all by date</a
              >
              /
              <a
                href=""
                id="select2"
                onclick="showPubs(2); return false;"
                style=""
                >show all by topic</a
              >)
            </h3>
            <div>
              <span class="venue">Year:</span>
              <span class="tag"
                ><a href="#2022" onclick="showPubs(1)">2022</a></span
              >
              /
              <span class="tag"
                ><a href="#2021" onclick="showPubs(1)">2021</a></span
              >
              /
              <span class="tag"
                ><a href="#2020" onclick="showPubs(1)">2020</a></span
              >
              /
              <span class="tag"
                ><a href="#2019" onclick="showPubs(1)">2019</a></span
              >
              /
              <span class="tag"
                ><a href="#2018" onclick="showPubs(1)">2018</a></span
              >
              /
              <span class="tag"
                ><a href="#2017" onclick="showPubs(1)">2017</a></span
              >
              /
              <span class="tag"
                ><a href="#2016" onclick="showPubs(1)">2016</a></span
              >
              /
              <span class="tag"
                ><a href="#2015" onclick="showPubs(1)">2015</a></span
              >
              /
              <span class="tag"
                ><a href="#2014" onclick="showPubs(1)">2014 and before</a></span
              >
            </div>
            <div>
              <span class="venue">Current Research Topics:</span>
              <span class="tag"
                ><a href="#phys" onclick="showPubs(2)"
                  >Physical Scene Understanding</a
                ></span
              >
              /
              <span class="tag"
                ><a href="#robot" onclick="showPubs(2)"
                  >Dynamics Models</a
                ></span
              >
              /
              <span class="tag"
                ><a href="#reason" onclick="showPubs(2)"
                  >Neuro-Symbolic Visual Reasoning</a
                ></span
              >
              /
              <span class="tag"
                ><a href="#gen" onclick="showPubs(2)"
                  >Generative Visual Models</a
                ></span
              >
              /
              <span class="tag"
                ><a href="#multi" onclick="showPubs(2)"
                  >Multi-Modal Perception;</a
                ></span
              >
              <span class="venue">Past Research Topic:</span>
              <span class="tag"
                ><a href="#wsl" onclick="showPubs(2)"
                  >Weakly-Supervised Learning</a
                ></span
              >
            </div>
            <div>
              <span class="tag"
                >(* and � indicate equal contribution or alphabetical
                order)</span
              >
            </div>
          </div>

          <div id="pubs">
            <div class="text anchor">&nbsp;</div>

            <div
              class="publication"
              v-for="item in paperList"
              :key="item.mdFile"
            >
              <div class="img">
                <img
                  class="img_responsive"
                  :src="item.img"
                  alt="spotlight_objectfolder2"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a
                    v-if="item.type === 'pdf'"
                    :href="'/pdf/' + item.file + '.pdf'"
                    target="_blank"
                  >
                    {{ item.title }}
                  </a>
                  <a
                    v-else
                    :href="'/paper-detail?paper=' + item.file"
                    target="_blank"
                  >
                    {{ item.title }}
                  </a>
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="https://ai.stanford.edu/~rhgao/">Hao Yin</a
                    >*</span
                  >

                  <span class="author jw">Hao Yin</span>
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://cvpr2022.thecvf.com/"
                      >{{ item.publisher }}
                      {{ (item.date + "").slice(0, 4) }}</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/objectfolder2_cvpr.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="https://ai.stanford.edu/~rhgao/objectfolder2.0/"
                      >Project Page</a
                    ></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import paperList from "../content/index";
import talkList from "../content/talks";
import webglList from "../static/webgl/index";
export default {
  name: "IndexPage",
  async asyncData({ $content }) {
    const page = await $content("hello").fetch();

    return {
      paperList,
      webglList,
      talkList,
    };
  },
};
</script>
