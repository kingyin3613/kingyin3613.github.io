<template>
  <div>
    <!-- <link rel="stylesheet" href="/font.css" />
    <link rel="stylesheet" href="/main.css" /> -->

    <div class="outercontainer">
      <header>
        <div class="container header">
          <div class="ftheader text">
            <a href="#home">Hao Yin</a>
          </div>
          <div class="ftsubheader text publication">
            <a href="#publications">Publications</a>
          </div>
          <div class="ftsubheader text talk">
            <a href="#talks">Talks</a>
          </div>
          <div class="ftsubheader text teaching">
            <a href="#teaching">Teaching</a>
          </div>
          <div class="ftsubheader text group">
            <a href="#group">Group</a>
          </div>
          <div class="ftsubheader text">
            <a href="#home">Home</a>
          </div>
        </div>
      </header>
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
        <div class="content group anchor" id="group">
          <div class="text front">
            <h3>Group</h3>
            <div class="title">Postdocs</div>
            <ul>
              <li>
                <a href="https://ai.stanford.edu/~rhgao/">Ruohan Gao</a> (with
                <a href="https://profiles.stanford.edu/fei-fei-li"
                  >Fei-Fei Li</a
                >
                and
                <a href="https://profiles.stanford.edu/silvio-savarese"
                  >Silvio Savarese</a
                >)
              </li>
              <li>
                <a href="https://yunzhuli.github.io/">Yunzhu Li</a> (with
                <a href="https://profiles.stanford.edu/fei-fei-li">Fei-Fei Li</a
                >)
              </li>
              <li>
                <a href="https://ai.stanford.edu/~zharu/">Ruohan Zhang</a> (with
                <a href="https://profiles.stanford.edu/fei-fei-li"
                  >Fei-Fei Li</a
                >
                and
                <a href="https://profiles.stanford.edu/silvio-savarese"
                  >Silvio Savarese</a
                >)
              </li>
            </ul>
            <div class="title">PhD Students</div>
            <ul>
              <li><a href="https://samuelpclarke.com/">Samuel Clarke</a></li>
              <li>
                <a href="https://ceyzaguirre4.github.io/"
                  >Cristobal Eyzaguirre</a
                >
                (with <a href="http://www.niebles.net/">Juan Carlos Niebles</a>)
              </li>
              <li>
                <a href="https://shellguo.com/">Michelle Guo</a> (with
                <a href="https://tml.stanford.edu/people/karen-liu">Karen Liu</a
                >)
              </li>
              <li><a href="http://web.stanford.edu/~joycj/">Joy Hsu</a></li>
              <li>
                <a href="https://kylehsu.org/">Kyle Hsu</a> (with
                <a href="https://ai.stanford.edu/~cbfinn/">Chelsea Finn</a>)
              </li>
              <li>
                <a href="https://cs.stanford.edu/~sumith/">Sumith Kulal</a>
                (with
                <a href="http://theory.stanford.edu/~aiken/">Alex Aiken</a>)
              </li>
              <li>
                <a href="http://lijiaman.github.io/">Jiaman Li</a> (with
                <a href="https://tml.stanford.edu/people/karen-liu">Karen Liu</a
                >)
              </li>
              <li>
                <a href="https://mlingelbach.com/">Michael Lingelbach</a> (with
                <a href="https://profiles.stanford.edu/fei-fei-li">Fei-Fei Li</a
                >)
              </li>
              <li><a href="https://s-tian.github.io/">Stephen Tian</a></li>
              <li><a href="https://kovenyu.com/">Koven Yu</a></li>
              <li>
                <a href="https://ai.stanford.edu/~yzzhang/">Yunzhi Zhang</a>
              </li>
            </ul>
            <div class="title">Alumnus</div>
            <ul>
              <li><a href="http://hxu.rocks/">Huazhe Xu</a></li>
            </ul>
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
            <span>
              Naturally Supervised Vision (July 2022)
              <div
                src="/assets/y_DNZTDmA0s.html"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen=""
              ></div>
            </span>
            <span>
              Multi-Sensory Neural Objects (Oct 2022)
              <div
                src="/assets/6b5M0kx_MKg.html"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen=""
              ></div>
            </span>
            <span>
              Research Overview (Apr 2021)
              <div
                src="/assets/0c6bEyXQ898.html"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen=""
              ></div>
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

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_objectfolder2.jpg"
                  alt="spotlight_objectfolder2"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a
                    name="objectfolder2_cvpr"
                    href="papers/objectfolder2_cvpr.pdf"
                    >ObjectFolder 2.0: A Multisensory Object Dataset for
                    Sim2Real Transfer</a
                  >
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="https://ai.stanford.edu/~rhgao/">Ruohan Gao</a
                    >*</span
                  >,
                  <span class="author"
                    ><a href="https://si-lynnn.github.io/">Zilin Si</a>*</span
                  >,
                  <span class="author"
                    ><a href="https://yuyuchang.github.io/">Yen-Yu Chang</a
                    >*</span
                  >,
                  <span class="author"
                    ><a href="https://samuelpclarke.com/"
                      >Samuel Clarke</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.stanford.edu/~bohg/"
                      >Jeannette Bohg</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="https://profiles.stanford.edu/fei-fei-li/"
                      >Li Fei-Fei</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://robotouch.ri.cmu.edu/yuanwz/"
                      >Wenzhen Yuan</a
                    ></span
                  >,
                  <span class="author jw">Hao Yin</span>
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://cvpr2022.thecvf.com/">CVPR 2022</a></span
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

            <div class="publication">
              <div class="img">
                <video
                  class="img_responsive"
                  autoplay=""
                  muted=""
                  loop=""
                  webkit-playsinline=""
                  playsinline=""
                >
                  <source
                    src="images/spotlight_behavior1k.mp4"
                    type="video/mp4"
                  />
                  spotlight_behavior1k
                </video>
              </div>
              <div class="text">
                <div class="title">
                  <a name="behavior1k_corl" href="papers/behavior1k_corl.pdf"
                    >BEHAVIOR-1K: A Benchmark for Embodied AI with 1,000
                    Everyday Activities and Realistic Simulation</a
                  >
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="https://www.chengshuli.me/">Chengshu Li</a>*</span
                  >,
                  <span class="author"
                    ><a href="https://ai.stanford.edu/~zharu/">Ruohan Zhang</a
                    >*</span
                  >,
                  <span class="author"
                    ><a href="https://www.jowo.me/">Josiah Wong</a>*</span
                  >,
                  <span class="author"
                    ><a href="https://www.cemgokmen.com/">Cem Gokmen</a>*</span
                  >, <span class="author">Sanjana Srivastava*</span>,
                  <span class="author"
                    ><a href="https://robertomartinmartin.com/"
                      >Roberto Martin-Martin</a
                    >*</span
                  >,
                  <span class="author"
                    ><a href="https://www.chenwangjeremy.net/">Chen Wang</a
                    >*</span
                  >,
                  <span class="author"
                    ><a href="https://www.gabrael.io/">Gabrael Levine</a>*</span
                  >,
                  <span class="author"
                    ><a href="https://mlingelbach.com/"
                      >Michael Lingelbach</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.stanford.edu/~jksun/"
                      >Jiankai Sun</a
                    ></span
                  >, <span class="author">Mona Anvari</span>,
                  <span class="author"
                    ><a href="https://mj-hwang.github.io/"
                      >Minjune Hwang</a
                    ></span
                  >, <span class="author">Manasi Sharma</span>,
                  <span class="author">Arman Aydin</span>,
                  <span class="author"
                    ><a href="https://dhruvabansal.com/">Dhruva Bansal</a></span
                  >, <span class="author">Samuel Hunter</span>,
                  <span class="author"
                    ><a href="https://kykim0.github.io/">Kyu-Young Kim</a></span
                  >, <span class="author">Alan Lou</span>,
                  <span class="author">Caleb R. Matthews</span>,
                  <span class="author">Ivan Villa-Renteria</span>,
                  <span class="author">Jerry Huayang Tang</span>,
                  <span class="author">Claire Tang</span>,
                  <span class="author"
                    ><a href="https://fxia22.github.io/">Fei Xia</a></span
                  >,
                  <span class="author"
                    ><a href="https://profiles.stanford.edu/silvio-savarese"
                      >Silvio Savarese</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="https://web.stanford.edu/~hyo/Home.html"
                      >Hyowon Gweon</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="https://tml.stanford.edu/people/karen-liu"
                      >C. Karen Liu</a
                    ></span
                  >, <span class="author jw">Hao Yin</span>,
                  <span class="author"
                    ><a href="https://profiles.stanford.edu/fei-fei-li/"
                      >Li Fei-Fei</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://www.robot-learning.org/"
                      >CoRL 2022</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/behavior1k_corl.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="https://behavior.stanford.edu/"
                      >Project Page</a
                    ></span
                  >
                </div>
                <div>
                  <span class="highlight">Oral Presentation</span>
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <video
                  class="img_responsive"
                  autoplay=""
                  muted=""
                  loop=""
                  webkit-playsinline=""
                  playsinline=""
                >
                  <source src="images/spotlight_pvd.mp4" type="video/mp4" />
                  spotlight_pvd
                </video>
              </div>
              <div class="text">
                <div class="title">
                  <a name="pvd_iccv" href="papers/pvd_iccv.pdf"
                    >3D Shape Generation and Completion Through Point-Voxel
                    Diffusion</a
                  >
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="https://alexzhou907.github.io/"
                      >Linqi Zhou</a
                    ></span
                  ><a href="https://alexzhou907.github.io/"
                    >, <span class="author"></span></a
                  ><a href="https://yilundu.github.io/">Yilun Du</a>,
                  <span class="author jw">Hao Yin</span>
                </div>
                <div>
                  <span class="venue"
                    ><a href="http://iccv2021.thecvf.com/home"
                      >ICCV 2021</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/pvd_iccv.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="https://alexzhou907.github.io/pvd"
                      >Project Page</a
                    ></span
                  >
                </div>
                <div>
                  <span class="highlight">Oral Presentation</span>
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <video
                  class="img_responsive"
                  autoplay=""
                  muted=""
                  loop=""
                  webkit-playsinline=""
                  playsinline=""
                >
                  <source src="images/spotlight_bpi.mp4" type="video/mp4" />
                  spotlight_bpi
                </video>
              </div>
              <div class="text">
                <div class="title">
                  <a name="bpi_nips" href="papers/bpi_nips.pdf"
                    >Multi-Plane Program Induction with 3D Box Priors</a
                  >
                </div>
                <div class="authors">
                  <span class="author">Yikai Li*</span>,
                  <span class="author"
                    ><a href="http://jiayuanm.com/">Jiayuan Mao</a>*</span
                  >,
                  <span class="author"
                    ><a href="https://xiuming.info/">Xiuming Zhang</a></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://www.cs.cornell.edu/~snavely/"
                      >Noah Snavely</a
                    ></span
                  >,
                  <span class="author jw">Hao Yin</span>
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://nips.cc/Conferences/2020"
                      >NeurIPS 2020</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/bpi_nips.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://bpi.csail.mit.edu/">Project Page</a></span
                  >
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_dissertation.png"
                  alt="spotlight_dissertation"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="dissertation" href="papers/dissertation.pdf"
                    >Learning to See the Physical World</a
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="papers/dissertation.pdf"
                      >PhD Dissertation 2019</a
                    ></span
                  >
                </div>
                <div>
                  <span class="highlight"
                    ><a
                      href="https://awards.acm.org/about/2019-doctoral-dissertation"
                      >ACM Doctoral Dissertation Award Honorable Mention</a
                    ></span
                  ><br />
                  <span class="highlight"
                    >Joint AAAI/ACM SIGAI Doctoral Dissertation Award</span
                  ><br />
                  <span class="highlight"
                    >MIT George M. Sprowls PhD Thesis Award in Artificial
                    Intelligence and Decision-Making</span
                  >
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_nscl.jpg"
                  alt="spotlight_nscl"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="nscl_iclr" href="papers/nscl_iclr.pdf"
                    >The Neuro-Symbolic Concept Learner:<br />Interpreting
                    Scenes, Words, and Sentences from Natural Supervision</a
                  >
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="http://jiayuanm.com/">Jiayuan Mao</a></span
                  >,
                  <span class="author"
                    ><a href="http://people.csail.mit.edu/ganchuang/"
                      >Chuang Gan</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="https://sites.google.com/site/pushmeet/"
                      >Pushmeet Kohli</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >,
                  <span class="author jw">Hao Yin</span>
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://openreview.net/forum?id=rJgMlhRctm"
                      >ICLR 2019</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/nscl_iclr.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://nscl.csail.mit.edu/">Project Page</a></span
                  >
                  /
                  <span class="tag"
                    ><a
                      href="http://news.mit.edu/2019/teaching-machines-to-reason-about-what-they-see-0402"
                      >MIT News</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a
                      href="https://www.technologyreview.com/s/613270/two-rival-ai-approaches-combine-to-let-machines-learn-about-the-world-like-a-child/"
                      >MIT Technology Review</a
                    ></span
                  >
                </div>
                <div>
                  <span class="highlight">Oral Presentation</span>
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_shape2prog.jpg"
                  alt="spotlight_shape2prog"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="shape2prog_iclr" href="papers/shape2prog_iclr.pdf"
                    >Learning to Infer and Execute 3D Shape Programs</a
                  >
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="http://people.csail.mit.edu/yonglong/"
                      >Yonglong Tian</a
                    ></span
                  >, <span class="author">Andrew Luo</span>,
                  <span class="author"
                    ><a href="https://xingyuansun.com/">Xingyuan Sun</a></span
                  >,
                  <span class="author"
                    ><a href="https://www.cs.cornell.edu/~ellisk/"
                      >Kevin Ellis</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >,
                  <span class="author jw">Hao Yin</span>
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://openreview.net/forum?id=rylNH20qFQ"
                      >ICLR 2019</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/shape2prog_iclr.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://shape2prog.csail.mit.edu/"
                      >Project Page</a
                    ></span
                  >
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <video
                  class="img_responsive"
                  autoplay=""
                  muted=""
                  loop=""
                  webkit-playsinline=""
                  playsinline=""
                >
                  <source src="images/spotlight_vd.mp4" type="video/mp4" />
                  spotlight_vd
                </video>
              </div>
              <div class="text">
                <div class="title">
                  <a name="vd_tpami" href="papers/vd_tpami.pdf"
                    >Visual Dynamics: Stochastic Future Generation via Layered
                    Cross Convolutional Networks</a
                  >
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="https://tianfan.info/">Tianfan Xue</a>*</span
                  >, <span class="author jw">Hao Yin*</span>,
                  <span class="author"
                    ><a href="http://users.cms.caltech.edu/~klbouman/"
                      >Katherine L. Bouman</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://ieeexplore.ieee.org/document/8409321/"
                      >TPAMI 2019</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/vd_tpami.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://visualdynamics.csail.mit.edu/"
                      >Project Page</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://nips.cc/Conferences/2016"
                      >NeurIPS 2016</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/vd_nips.pdf">Paper</a></span
                  >
                </div>
                <div>
                  <span class="highlight">Oral Presentation</span>
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_genre.jpg"
                  alt="spotlight_genre"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="genre_nips" href="papers/genre_nips.pdf"
                    >Learning to Reconstruct Shapes from Unseen Classes</a
                  >
                </div>
                <div class="authors">
                  <span class="author"
                    ><a href="https://xiuming.info/">Xiuming Zhang</a>*</span
                  >,
                  <span class="author"
                    ><a href="https://ztzhang.info/">Zhoutong Zhang</a>*</span
                  >, <span class="author">Chengkai Zhang</span>,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >,
                  <span class="author jw">Hao Yin</span>
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://nips.cc/Conferences/2018"
                      >NeurIPS 2018</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/genre_nips.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://genre.csail.mit.edu/"
                      >Project Page</a
                    ></span
                  >
                </div>
                <div>
                  <span class="highlight">Oral Presentation</span>
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_3dinn.jpg"
                  alt="Spotlight_3dinn"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="3dinn_ijcv" href="papers/3dinn_ijcv.pdf"
                    >3D Interpreter Networks for Viewer-Centered Wireframe
                    Modeling</a
                  >
                </div>
                <div class="authors">
                  <span class="author jw">Hao Yin*</span>,
                  <span class="author"
                    ><a href="https://tianfan.info/">Tianfan Xue</a>*</span
                  >,
                  <span class="author"
                    ><a href="https://clvrai.com/web_lim/"
                      >Joseph J. Lim</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://yuandong-tian.com/">Yuandong Tian</a></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="https://groups.csail.mit.edu/vision/torralbalab/"
                      >Antonio Torralba</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a
                      href="https://link.springer.com/article/10.1007/s11263-018-1074-6"
                      >IJCV 2018</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/3dinn_ijcv.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://3dinterpreter.csail.mit.edu/"
                      >Project Page</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://www.eccv2016.org/">ECCV 2016</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/3dinn_eccv.pdf">Paper</a></span
                  >
                </div>
                <div>
                  <span class="highlight">Oral Presentation</span>
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <video
                  class="img_responsive"
                  autoplay=""
                  muted=""
                  loop=""
                  webkit-playsinline=""
                  playsinline=""
                >
                  <source src="images/spotlight_vda.mp4" type="video/mp4" />
                  spotlight_vda
                </video>
              </div>
              <div class="text">
                <div class="title">
                  <a name="vda_nips" href="papers/vda_nips.pdf"
                    >Learning to See Physics via Visual De-animation</a
                  >
                </div>
                <div class="authors">
                  <span class="author jw">Hao Yin</span>,
                  <span class="author"
                    ><a href="https://erikalu.com/">Erika Lu</a></span
                  >,
                  <span class="author"
                    ><a href="https://sites.google.com/site/pushmeet/"
                      >Pushmeet Kohli</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://nips.cc/Conferences/2017"
                      >NeurIPS 2017</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/vda_nips.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://vda.csail.mit.edu/">Project Page</a></span
                  >
                  /
                  <span class="tag"
                    ><a
                      href="http://news.mit.edu/2017/computer-systems-predict-objects-responses-physical-forces-1214"
                      >MIT News</a
                    ></span
                  >
                </div>
                <div>
                  <span class="highlight">Spotlight Presentation</span>
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_marrnet.jpg"
                  alt="Spotlight_marrnet"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="marrnet_nips" href="papers/marrnet_nips.pdf"
                    >MarrNet: 3D Shape Reconstruction via 2.5D Sketches</a
                  >
                </div>
                <div class="authors">
                  <span class="author jw">Hao Yin*</span>,
                  <span class="author"
                    ><a href="https://homes.cs.washington.edu/~yifan1/"
                      >Yifan Wang</a
                    >*</span
                  >,
                  <span class="author"
                    ><a href="https://tianfan.info/">Tianfan Xue</a></span
                  >,
                  <span class="author"
                    ><a href="https://xingyuansun.com/">Xingyuan Sun</a></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://nips.cc/Conferences/2017"
                      >NeurIPS 2017</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/marrnet_nips.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://marrnet.csail.mit.edu/"
                      >Project Page</a
                    ></span
                  >
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_3dgan.jpg"
                  alt="Spotlight_3dgan"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="3dgan_nips" href="papers/3dgan_nips.pdf"
                    >Learning a Probabilistic Latent Space of Object Shapes via
                    3D Generative-Adversarial Modeling</a
                  >
                </div>
                <div class="authors">
                  <span class="author jw">Hao Yin*</span>,
                  <span class="author">Chengkai Zhang*</span>,
                  <span class="author"
                    ><a href="https://tianfan.info/">Tianfan Xue</a></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://nips.cc/Conferences/2016"
                      >NeurIPS 2016</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/3dgan_nips.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://3dgan.csail.mit.edu/"
                      >Project Page</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a
                      href="https://www.technologyreview.com/s/603107/ai-begins-to-understand-the-3-d-world/"
                      >MIT Technology Review</a
                    ></span
                  >
                </div>
              </div>
            </div>

            <div class="publication">
              <div class="img">
                <img
                  class="img_responsive"
                  src="/assets/spotlight_galileo.jpg"
                  alt="Spotlight_galileo"
                />
              </div>
              <div class="text">
                <div class="title">
                  <a name="galileo_nips" href="papers/galileo_nips.pdf"
                    >Galileo: Perceiving Physical Object Properties by
                    Integrating a Physics Engine with Deep Learning</a
                  >
                </div>
                <div class="authors">
                  <span class="author jw">Hao Yin*</span>,
                  <span class="author"
                    ><a href="https://psychology.yale.edu/people/ilker-yildirim"
                      >Ilker Yildirim</a
                    >*</span
                  >,
                  <span class="author"
                    ><a href="https://clvrai.com/web_lim/"
                      >Joseph J. Lim</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://billf.mit.edu/"
                      >William T. Freeman</a
                    ></span
                  >,
                  <span class="author"
                    ><a href="http://web.mit.edu/cocosci/josh.html"
                      >Joshua B. Tenenbaum</a
                    ></span
                  >
                </div>
                <div>
                  <span class="venue"
                    ><a href="https://nips.cc/Conferences/2015"
                      >NeurIPS 2015</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a href="papers/galileo_nips.pdf">Paper</a></span
                  >
                  /
                  <span class="tag"
                    ><a href="http://galileo.csail.mit.edu/"
                      >Project Page</a
                    ></span
                  >
                  /
                  <!-- <span class="tag"><a href="http://phys.csail.mit.edu/galileo/mass/">Demo</a></span> -->
                  <span class="tag"
                    ><a
                      href="http://news.mit.edu/2016/csail-computer-model-matches-humans-predicting-how-objects-move-0104"
                      >MIT News</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a
                      href="http://motherboard.vice.com/read/how-to-teach-a-robot-to-build-a-rube-goldberg-machine"
                      >VICE</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a
                      href="http://www.wired.com/2016/01/mit-researchers-are-figuring-out-how-robots-can-wash-dishes/"
                      >WIRED</a
                    ></span
                  >
                  /
                  <span class="tag"
                    ><a
                      href="http://www.engadget.com/2016/01/05/mit-galileo-object-predictions/"
                      >Engadget</a
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
export default {
  name: "IndexPage",
  async asyncData({ $content }) {
    const page = await $content("hello").fetch();

    return {
      page,
    };
  },
};
</script>
