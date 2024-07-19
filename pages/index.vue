<template>
  <div>
    <div class="outercontainer">
      <Header />
      <div class="container body">
        <div class="content heading anchor" id="home">
          <div class="img">
            <img class="img_responsive" src="/assets/HaoYin.jpg" alt="Photo" />
          </div>

          <div class="text info">
            <h1>Hao Yin (银皓)</h1>
            <p></p>
            <div>Research Associate</div>

            <div>Cambridge University</div>
            <div>
              Email:&nbsp;hy423 [at] cam (dot) ac (dot) uk
            </div>
            <p>
              <span
                ><a
                  href="https://scholar.google.com/citations?user=pB-bgC4AAAAJ&hl=en/"
                  >Google Scholar</a
                ></span
              >
              /
              <span><a href="https://github.com/kingyin3613/">Github</a></span>
              /
              <span
                ><a href="https://www.linkedin.com/in/hao-yin-a86a95166/"
                  >LinkedIn</a
                ></span
              >
              /
              <span
                ><a href="https://twitter.com/king_yin3613/">Twitter</a></span
              >
            </p>
            <p></p>
          </div>

          <div class="text topic">
            <p></p>
            <div class="title">Research Interests</div>
            <ul>
              <li>
                <a
                  href="#lattice"
                  @click="categoryCounter('Lattice Models', 'topic')"
                  >Lattice Models</a
                >
              </li>
              <li>
                <a
                  href="#fracture"
                  @click="categoryCounter('Fracture Mechanics', 'topic')"
                  >Fracture Mechanics</a
                >
              </li>
              <li>
                <a
                  href="#Architected"
                  @click="categoryCounter('Architected Materials', 'topic')"
                  >Architected Materials</a
                >
              </li>
              <li>
                <a
                  href="#geometry"
                  @click="categoryCounter('Generative Geometry', 'topic')"
                  >Generative Geometry</a
                >
              </li>
              <li>
                <a
                  href="#multiphysics"
                  @click="categoryCounter('Multiphysics', 'topic')"
                  >Multiphysics</a
                >
              </li>
            </ul>
            <p></p>
          </div>

          <div class="text">
			<p>
			  I am a Research Associate working in the
              <a href="https://cambridgesolidmechanics.co.uk/"
                >Cambridge Solid Mechanics Group</a
              >. I am focusing on the development of advanced analytical techniques for
              coupled transport-mechanical behaviors of complex lattice systems (e.g., architected composites, wood microstructure). My research
              interests include lattice/discrete models,
              fracture mechanics, multiphysics, architected materials, and generative geometry.
            </p>

            <p>
	          Before joining Cambridge, I received my PhD in Civil Engineering
			  from Northwestern University, under the supervision of 
              <a href="https://sites.northwestern.edu/m2im/">Dr. Gianluca Cusatis</a>, and continued as a postdoc. 
			  My dissertation titled "Discrete Modeling of Fracture 
			  and Flow in Porous Quasi-brittle Materials by Capturing the Internal Structure" 
			  (Committee: Zdeněk Bažant, Gianluca Cusatis, Eric Landis, and John Rudnicki)
			  is temporarily unavailable to the public, due to copyright issues. 
			  However, you may click the research topics below to see my work during doctoral training. I also got my master’s degree in
              Civil Engineering from <a href="https://cee.illinois.edu/">the University of Illinois at Urbana-Champaign (UIUC)</a>
               and my bachelor’s degree in Civil Engineering from
              <a href="http://en.cau.edu.cn/"
              >China Agricultural University (CAU)</a
              >, China.
			</p>
			
            <p>
              While not focusing on my research, I spend my time staying with my two little chinchillas (sadly, now both two went to a better place) or traveling across the country.
            </p>

            <p>
			  My detailed Curriculum Vitae can be found <a href="http://haoyin.io/pdf/Yin-CV-03012024.pdf">here</a>.
            </p>
          </div>
        </div>

        <!-- webgl -->
        <div class="content talk anchor" id="research">
          <div class="text front webgl-list">
            <h2>Research</h2>
            <ul>
              <li
                v-for="(item, index) in webglList"
                :key="item.category + index"
                @click="taggleShowClick(index)"
              >
                <a style="color: #0055aa">{{ item.category }}</a>
                <div class="webgl-card" v-if="taggleShow === index">
                  <p v-html="item.desc"></p>
                  <template v-for="(it, idx) in item.list">
                    <a
                      @click.stop=""
                      target="_blank"
                      :key="idx"
                      :href="
                        it.type == 'md'
                          ? '/paper-detail?paper=' + it.file
                          : '/webgl/' + it.file
                      "
                    >
                      {{ it.title }}
                      <img :src="'/webgl/img/' + it.img" />
                    </a>
                  </template>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="content teaching anchor" id="activities">
          <div class="text front">
            <h2>Activities</h2>

            <h3>Teaching</h3>
            <ul>
              <li>
                <a
                  href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Winter 2022</a
                >
                (<a href="/pdf/Evaluation_CIV_ENV216_WI22.pdf"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a
                  href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Spring 2021</a
                >
                (<a href="/pdf/Evaluation_CIV_ENV216_SP21.pdf"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a
                  href="https://www.mccormick.northwestern.edu/mechanical/academics/courses/descriptions/327-finite-element-methods-in-mechanics.html"
                  >MECH_ENG 327: Finite Elements Methods in Mechanics, Fall
                  2020</a
                >
                (<a href="/pdf/Evaluation_MECH_ENG327_FA20.pdf"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a
                  href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Spring 2020</a
                >
                (<a href="/pdf/Evaluation_CIV_ENV216_SP20.pdf"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a
                  href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Winter 2020</a
                >
              </li>
              <li>
                <a
                  href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Winter 2019</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="content talk anchor" id="talks">
          <div class="text front">
            <h3>Talks</h3>
            <div>
              <span v-for="(item, index) in talkList" :key="item.title + index">
                <a
                  v-if="item.type === 'pdf'"
                  target="_blank"
                  :href="'/pdf/' + item.file + '.pdf'"
                >
                  {{ item.title }}
                  <img :src="item.img" />
                </a>
                <a
                  v-else-if="item.type === 'link'"
                  target="_blank"
                  :href="item.file"
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
                <p class="justify-between">
                  <span>{{ item.date }} &nbsp;&nbsp;&nbsp;{{ item.address }}</span>
                  <!-- <span></span> -->
                </p>
              </span>
            </div>
          </div>
        </div>

        <div class="content anchor" id="publications">
          <div class="text front">
            <h2>Publications</h2>
            <div>
              <span class="venue">Year:</span>

              <span class="tag" v-for="(item, idx) in paperDate" :key="item"
                ><a
                  href="javascropt:viod()"
                  @click="categoryCounter(item, 'date')"
                  >{{ item }}</a
                >
                <span v-if="idx < paperDate.length - 1">/</span></span
              >
            </div>
            <div>
              <span class="venue">Current Research Topics:</span>
              <template v-for="(item, idx) in paperTopic">
                <span class="tag" :key="item" v-if="item">
                  <a
                    href="javascropt:viod()"
                    @click="categoryCounter(item, 'topic')"
                    >{{ item }}</a
                  >
                  <span v-if="idx < paperTopic.length - 1">/</span>
                </span>
              </template>
            </div>
            <div></div>
          </div>

          <div id="pubs">
            <div class="text anchor">&nbsp;</div>
            <div
              v-for="data in paperList"
              :key="data.mdFile"
              :id="'pubs' + data.categoryName"
            >
              <h3 v-if="data.categoryName">{{ data.categoryName }}</h3>
              <div
                class="publication"
                v-for="(item, index) in data.list"
                :key="index"
              >
                <div class="img">
                  <img class="img_responsive" :src="item.img" />
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
                      v-else-if="item.type === 'link'"
                      :href="item.file"
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
                    <span class="author" v-html="item.author"></span>
                  </div>
                  <div>
                    <span class="venue"
                      ><a
                        >{{ item.publisher }}
                        {{ (item.date + "").slice(0, 4) }}</a
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
  </div>
</template>

<script>
import paperList from "../content/index";
import talkList from "../content/talks";
import webglList from "../static/webgl/index";

// 左上角topiclist

const topicList = ["Lattice Models"];
export default {
  name: "IndexPage",
  async asyncData({ $content }) {
    return {
      webglList,
      talkList,
      // taggleShow: "",
    };
  },
  data() {
    return {
      taggleShow: "",
      paperDate: [
        ...new Set(
          paperList.map((v) => (v.date > 2021 ? v.date : "2021 and before"))
        ),
      ].sort((a, b) => b - a),
      paperTopic: [...new Set(paperList.map((v) => v.topic))],
      paperList: [
        {
          list: paperList.sort((a, b) => b.date - a.date),
        },
      ],
    };
  },
  methods: {
    taggleShowClick(index) {
      this.taggleShow = this.taggleShow === index ? "" : index;
    },
    categoryCounter(anchor, categoryType) {
      var data = {};
      paperList.forEach((v) => {
        const cate =
          categoryType == "date" && v[categoryType] < 2022
            ? "2021 and before"
            : v[categoryType];
        data[cate] = data[cate] || {
          categoryName: cate,
          list: [],
        };
        data[cate].list.push(v);
      });
      this.paperList = Object.values(data).sort(
        (a, b) => b.categoryName - a.categoryName
      );

      setTimeout(() => {
        window["pubs" + anchor] &&
          window["pubs" + anchor].scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
      }, 1000 / 60);
    },
  },
};
</script>
