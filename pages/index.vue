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
            <div>PhD Candidate</div>
            <div>Department of Civil and Environmental Engineering</div>
            <div>Northwestern University</div>
            <div>
              Email:&nbsp;haoyin2022 [at] u (dot) northwestern (dot) edu
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
                ><a href="https://twitter.com/king_yin3613/"
                  >Twitter</a
                ></span
              >
            </p>
            <p></p>
          </div>

          <div class="text topic">
            <p></p>
            <div class="title">Research Interests</div>
            <ul>
              <li>
                <a href="#phys" onclick="showPubs(2)">Lattice Models</a>
              </li>
              <li>
                <a href="#robot" onclick="showPubs(2)">Fracture Mechanics</a>
              </li>
              <li>
                <a href="#reason" onclick="showPubs(2)"
                  >Bio-inspired Materials</a
                >
              </li>
              <li>
                <a href="#gen" onclick="showPubs(2)">Multiphysics</a>
              </li>
              <li>
                <a href="#multi" onclick="showPubs(2)">Generative Geometry</a>
              </li>
            </ul>
            <p></p>
          </div>

          <div class="text">
            <p>
              I am a Ph.D. candidate of
              <a
                href="https://www.mccormick.northwestern.edu/civil-environmental/"
                >Civil Engineering</a
              >
              working in the
              <a href="https://sites.northwestern.edu/m2im/"
                >Multiscale Mechanics of Infrastructure Materials (M2IM) Lab</a
              >
              at
              <a href="https://www.northwestern.edu/">Northwestern University</a
              >. I am currently completing my Ph.D. thesis, under the
              supervision of Dr. 
			  <a href="https://www.cusatis.us/">Gianluca Cusatis</a>, focusing
              on the construction of a novel computational framework for
              thermo-hygro-mechanical analyses of complex lattice systems (e.g.,
              wood mesostructure, bio-inspired composites). My research interests 
			  include computational mechanics, bio-inspired materials, multiphysics,
              poromechanics, and generative geometry.
            </p>

            <p>
              Before joining Northwestern, I received my bachelor’s degree in
              Civil Engineering from
              <a href="http://en.cau.edu.cn/"
                >China Agricultural University (CAU)</a
              >, China, and a master’s degree in
              <a href="https://cee.illinois.edu/">Civil Engineering</a>
              from
              <a href="https://illinois.edu/"
                >the University of Illinois at Urbana-Champaign (UIUC)</a
              >.
            </p>
          </div>
        </div>

        <!-- webgl -->
        <div class="content talk anchor" id="webgl">
          <div class="text front webgl-list">
            <h2>Visualizations</h2>
            <a
              target="_blank"
              v-for="item in webglList"
              :key="item.title"
              :href="'/webgl/' + item.file"
            >
              {{ item.title }}
              <img :src="'/webgl/img/' + item.img" />
            </a>
          </div>
        </div>

        <div class="content teaching anchor" id="teaching">
          <div class="text front">
            <h2>Activities</h2>

            <h3>Teaching</h3>
            <ul>
              <li>
                <a href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Winter 2022</a
                >
                (<a href="https://profiles.stanford.edu/fei-fei-li"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Spring 2021</a
                >
                (<a href="https://profiles.stanford.edu/fei-fei-li"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a href="https://www.mccormick.northwestern.edu/mechanical/academics/courses/descriptions/327-finite-element-methods-in-mechanics.html"
                  >MECH_ENG 327: Finite Elements Methods in Mechanics, Fall 2020</a
                >
                (<a href="https://profiles.stanford.edu/fei-fei-li"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Spring 2020</a
                >
                (<a href="https://profiles.stanford.edu/fei-fei-li"
                  >Course Evaluation</a
                >)
              </li>
              <li>
                <a href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Winter 2020</a
                >
              </li>
              <li>
                <a href="https://www.mccormick.northwestern.edu/civil-environmental/academics/courses/descriptions/216.html"
                  >CIV_ENV 216: Mechanics of Materials I, Winter 2019</a
                >
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
            <h2>
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
            </h2>
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
                  /
                  <span class="tag"><a>Paper</a></span>
                  /
                  <span class="tag"><a>Project Page</a></span>
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
