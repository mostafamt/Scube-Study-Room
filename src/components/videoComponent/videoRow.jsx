import React, { Component } from "react";
//import VideoCont from "./videoContainer/videoContainer"
import Description from "./VideoDescription/videoDescription";
//import Previous from "../previous/previous"
import "./VideoRow.css";
import LoList from "./loList/loList";
import PPlayer from "./PaellPlayer";
//import jwt_decode from "jwt-decode"
//import config from "../../config"
//import axios from "axios"
import Button from "react-bootstrap/Button";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// import "react-notifications-component/dist/theme.css"
import { store } from "react-notifications-component";
// import ReactNotifications from "react-notifications-component"

import axios from "../../axios";

import { ArrowForward, ArrowBack, ArrowBackIos } from "@material-ui/icons";

import Menu from "../Menu/Menu";
import Modal from "../Menu/Modal/Modal";

const backendURL = "/player";

class Videoall extends Component {
  state = {
    // PlayerType: 1,
    LObjID: 0,
    MofId: 0,
    Playlist: {},
    Framelist: {},
    AudioTrackList: {},
    playedLo: {},
    IsMediaFile: false,
    isCoursePlayer: true,
    // isurlobject: false,
    teacherMode: false,
    videoSource: "",
    mainTitle: "",
    subTitle: "",

    srcLanguage: "",
    urls: [],

    selectedvideoIndex: 0,

    toc: [],
    topicTitle: "",
    videoVtt: "",
    los: [],
    subTitles: [], // subTopics' titles

    headers: [],
    selectedListIndex: 0,
    selectedListItemIndex: "",
    nextOrPrev: true,
    loading: false, ///محمد/false/
    noError: true,
    noErrorLO: true,

    //-----------------------------------FOR description
    selectedLanguage: "default", //:"" mohammad
    title: "",
    transcriptShow: false,
    summaryShow: false,
    KeywordsShow: false,
    notesShow: false,
    keywords: [],
    summary25: "",
    summary50: "",
    isH5p: false,
    transcript: "",
    currentSummary: "",
    summaryPercent: "100",
    studentNotes: "",
    summaryCount: 1,
    keywordsCount: 1,
    notesCount: 1,
    navigationCounter: -1,
    contentType: "",
    isNormal: false,
    showModal: true,
    // Authorization: localStorage.getItem("access_token"),
    // IdToken: localStorage.getItem("id_token"),
    // TENANT_ID: localStorage.getItem("tenant_id"),
  };
  onUpdateCheckbox = (val) => {
    // this.onTranslationClick(this.state.selectedLanguage, val)
  };

  flatten = (arr, depth = 1) => {
    var result = [];
    arr.forEach(function (a) {
      //if (parentId) a.parentId = parentId
      let str = "sub".repeat(depth) + "Topics";
      result.push(a);
      if (Array.isArray(a[str])) {
        result = result.concat(module.exports.flatten(a[str], depth++));
      }
    });
    return result;
  };

  nextHandler = (e) => {
    if (this.state.selectedvideoIndex === this.state.los.length) return;
    console.log(this.state.selectedvideoIndex);
    this.setState((prevstate) => ({
      selectedvideoIndex: prevstate.selectedvideoIndex + 1,
    }));
    this.updateNavigationCounter();
    if (
      typeof this.state.los[this.state.selectedvideoIndex + 1] !== "undefined"
    ) {
      console.log("next");
      this.changeVideoSource(
        this.state.los[this.state.selectedvideoIndex + 1].id,
        this.state.selectedLanguage
      );
      this.changeTopicTitle(
        this.state.los[this.state.selectedvideoIndex + 1].title
      );
      this.selectedListItemIndexChangeHandler(
        this.state.headers[this.state.selectedvideoIndex + 1]
      );
    }
  };
  previousHandler = (e) => {
    if (this.state.selectedvideoIndex === 0) return;
    this.setState((prevstate) => ({
      selectedvideoIndex: prevstate.selectedvideoIndex - 1,
    }));
    this.updateNavigationCounter();

    this.changeVideoSource(
      this.state.los[this.state.selectedvideoIndex - 1].id,
      this.state.selectedLanguage
    );
    this.changeTopicTitle(
      this.state.los[this.state.selectedvideoIndex - 1].title
    );
    this.selectedListItemIndexChangeHandler(
      this.state.headers[this.state.selectedvideoIndex - 1]
    );
  };

  nextOrPrevHandler = (x) => {
    this.setState({ nextOrPrev: x });
  };

  changeSelectedVideoIndex = (x) => {
    this.setState({ selectedvideoIndex: x });
  };

  notify = (type, title, message, duration = 4000) => {
    store.addNotification({
      title,
      message,
      type,
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration,
      },
    });
  };

  handleSource = () => {
    console.log(this.state.toc);
    this.state.toc.forEach((topic) => {
      console.log(topic);
      topic.subTopics.forEach((subTopic) => {
        console.log(subTopic);
        subTopic.subSubTopics.forEach((lo) => {
          console.log("looooooo");
          console.log(lo);
          if (lo)
            this.setState({
              los: [...this.state.los, lo],
              subTitles: [...this.state.subTitles, subTopic.title],
              headers: [...this.state.headers, lo.title],
            });
        });
      });
    });
  };

  handleSource2 = () => {
    this.state.toc.forEach((topic) => {
      //console.log(topic)
      topic.subTopics.forEach((subTopic) => {
        //       console.log(subTopic)
        //       subTopic.subSubTopics.forEach((lo) => {
        // console.log("looooooo")
        // console.log(lo)
        if (subTopic)
          this.setState({
            los: [...this.state.los, subTopic],
            subTitles: [...this.state.subTitles, topic.title],
            headers: [...this.state.headers, subTopic.title],
          });
      });
      //   })
    });
  };

  selectedListIndexChangeHandler = (x) => {
    this.setState({ selectedListIndex: x });
  };

  selectedListItemIndexChangeHandler = (x) => {
    this.setState({ selectedListItemIndex: x });
  };

  // handleUrlChange = x => {
  //   this.setState({ urls: x });
  // };
  changeSelectedIndex(i) {
    this.setState({
      selectedvideoIndex: i,
    });
  }

  changeTopicTitle(newTitle, sub = "") {
    this.setState({
      topicTitle: newTitle,
      subTitle: sub,
    });
  }
  updateNavigationCounter() {
    this.setState({ navigationCounter: this.state.navigationCounter - 1 });
  }

  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    let courseCode = query.get("courseCode");
    let lessonCode = query.get("lessonCode");
    let MoId = query.get("MoId");
    let playlist = query.get("playList");
    let play_data = query.get("play_data");
    console.log(
      "🚀 ~ file: videoRow.jsx ~ line 212 ~ Videoall ~ componentDidMount ~ play_data",
      play_data
    );

    if (MoId) {
      this.setState({ MofId: MoId, IsMediaFile: true });
      this.changeVideoSource(MoId, "en");
    } else if (courseCode && lessonCode) {
      axios
        .get(`/data/adaptedCourse/${courseCode}/${lessonCode}/toc`)
        .then((res) => {
          //res.data.topics.shift();
          this.setState({
            toc: res.data.topics,
            mainTitle: res.data.title,
          });
          this.handleSource();

          this.changeVideoSource(
            this.state.los[this.state.selectedvideoIndex].LOid,
            "en"
          );
          this.changeTopicTitle(
            this.state.los[this.state.selectedvideoIndex].title,
            this.state.subTitles[this.state.selectedvideoIndex]
          );

          this.selectedListItemIndexChangeHandler(
            this.state.headers[this.state.selectedvideoIndex]
          );
          /// }

          this.setState({
            loading: true,
          });
        })
        .catch((err) => {
          this.setState({
            noError: false,
          });
          console.log(err);
          // handle err
        });
    } else if (playlist) {
      let parsejson = JSON.parse(atob(playlist));
      console.log(
        "🚀 ~ file: videoRow.jsx ~ line 286 ~ Videoall ~ componentDidMount ~ parsejson",
        parsejson
      );

      //this.handleSource()
      // var playlistobj = {
      //   title: "Lesson play list",
      //   topics: [
      //     {
      //       title: "Lesson play list",
      //       subTopics: [{ title: "Play list", subSubTopics: [{}] }],
      //     },
      //   ],
      // }
      const topics = [
        {
          title: parsejson.title,
          subTopics: parsejson.subSubTopics,
        },
      ];

      // playlistobj.topics[0].subTopics[0].subSubTopics = parsejson.subSubTopics
      // playlistobj.topics[0].subTopics[0].title = parsejson.title + ""
      console.log(topics.subTopics);
      setTimeout(() => {
        this.setState({
          toc: [{ subTopics: parsejson.subSubTopics, title: parsejson.title }],
          mainTitle: parsejson.title,
        });
        this.flatten2(parsejson.subSubTopics);

        //         function () {
        this.handleSource2();
        // this.state.headers.forEach((header, cou) => {
        //   if (header === parsejson) {
        //     this.props.changeSelectedIndex(cou)
        //   }
        // })
        //this.changeSelectedIndex(0)
        //this.changeIndexHandler(parsejson.subSubTopics[0].title)
        this.selectedListItemIndexChangeHandler(
          parsejson.subSubTopics[0].title
        );
        this.changeTopicTitle(parsejson.subSubTopics[0].title, parsejson.title);
        this.changeVideoSource(parsejson.subSubTopics[0].LOid);
        // this.selectedListItemIndexChangeHandler(
        //   this.state.headers[this.state.selectedvideoIndex]
        // )

        //console.log(this.state.selectedvideoIndex,this.state.selectedListItemIndex,this.state.selectedListItemIndexChangeHandler,this.state.toc)
        //this.setState({los: parsejson.subSubTopics},()=>{

        //  this.changeVideoSource(
        //    this.state.los[this.state.selectedvideoIndex].LOid,
        //    "en"
        //  )

        //  this.changeTopicTitle(
        //    this.state.los[this.state.selectedvideoIndex].title,
        //    this.state.subTitles[this.state.selectedvideoIndex]
        //  )
        //})
        //       }
        //   )
      }, 30);
      this.setState({
        loading: true,
      });
    } else if (play_data) {
      const decoded_play_data = JSON.parse(atob(play_data));
      axios.get(`/lom/playlist/${decoded_play_data.id}`).then((res) => {
        this.setState({
          mainTitle: res.data.title,
          IsMediaFile: res.data.type === "mo",
        });
        if (res.data.type === "mo") {
          this.setState({ MofId: res.data.playList[0]._id, IsMediaFile: true });
          this.setState({ contentType: res.data.playList[0].contentType });
          this.changeVideoSource(
            res.data.playList[0]._id,
            res.data.playList[0].language
          );
        } else {
          this.flatten(res.data.playList);
          this.setState({ toc: res.data.playList });
        }
      });

      //   this.handleSource()

      //   this.selectedListItemIndexChangeHandler(parsejson.subSubTopics[0].title)
      //   this.changeTopicTitle(parsejson.subSubTopics[0].title, parsejson.title)
      //   this.changeVideoSource(parsejson.subSubTopics[0].LOid)

      // }, 30)
      this.setState({
        loading: true,
      });
    } else {
      this.setState({ loading: true });
    }
  }

  flatten = (arr) => {
    arr.forEach((item) => {
      item.objects.forEach((lo) => {
        console.log(lo);
        if (lo.id)
          this.setState({
            los: [...this.state.los, lo],
            //        subTitles: [...this.state.subTitles, subTopic.title],
            headers: [...this.state.headers, lo.title],
          });
        if (Array.isArray(item.children)) {
          this.flatten(item.children);
        }
      });
    });
  };
  flatten2 = (arr) => {
    arr.forEach((lo) => {
      console.log(lo);
      if (lo && lo.LOid)
        this.setState({
          los: [...this.state.los, lo],
          //        subTitles: [...this.state.subTitles, subTopic.title],
          headers: [...this.state.headers, lo.title],
        });
    });
  };

  changeVideoSource(loId, language = "en") {
    document.getElementById("cover-spin").style.display = "";

    this.setState({ LObjID: loId });

    if (typeof loId !== "undefined") {
      language = this.state.selectedLanguage;
      this.setState({
        noErrorLO: true,
      });

      axios
        .get(`${backendURL}/getPlayedLo/${loId}/${language}/0`)
        .then(async (response) => {
          this.setState({
            videoVtt: response.data.vttSignedUrlarr,
            isNormal: response.data.type === "normal",
          });
          if (
            response.data.loSignedUrl.includes("s3.eu-west-1.amazonaws.com/")
          ) {
            const url = response.data.loSignedUrl
              .split("s3.eu-west-1.amazonaws.com/")[1]
              .split("?AWSAccessKeyId")[0];
            this.setState({
              isH5p:
                response.data.isTemp ||
                (url.startsWith("h5p") && url.endsWith(".html")),
            });
          } else this.setState({ isH5p: false });

          const currentLanguage =
            language === "default" ? response.data.language : language;

          localStorage.setItem("currentLanguage", currentLanguage);
          this.setState({
            videoSource: response.data.loSignedUrl,
            srcLanguage: response.data,
            videoVtt: response.data.vttSignedUrl,
            transcript: response.data.transcript,
            summary25: response.data.summary25,
            summary50: response.data.summary50,
            topicTitle: response.data.title,
            currentSummary: response.data.transcript,
            keywords: response.data.keywords,
            loading: true,
            Framelist: response.data.frameList,
            AudioTrackList: response.data.audioList,
            playedLo: response.data,
          });
          // this.setState({
          //   availableLanguage: response.data.audioList,
          // })
          //    document.getElementById("cover-spin").style.display = "none"

          if (this.state.loading)
            document.getElementById("cover-spin").style.display = "none";
          if ("frameList" in response.data) {
            document.getElementById("scales").style.visibility = "visible";
            document.getElementById("label10").style.visibility = "visible";
          } else {
            document.getElementById("scales").style.visibility = "hidden";
            document.getElementById("label10").style.visibility = "hidden";
          }

          if (this.state.teacherMode === false) {
            this.onSummaryClick("full_transcript");
            //document.getElementById("langSelect").value = language

            axios
              .get(`${backendURL}/getStudentNotes/${loId}`)
              .then((res) => {
                if (res.data) this.setState({ studentNotes: res.data });
                else
                  this.setState({
                    studentNotes: this.state.transcript.replace(
                      /\r?\n/g,
                      "<br />"
                    ),
                  }); //+"." })
                ///i added dot here for enable editing/
              })
              .catch((err) => {
                this.setState({
                  studentNotes: this.state.transcript.replace(
                    /\r?\n/g,
                    "<br />"
                  ),
                });
              });
          }

          if (document.getElementById("langSelect"))
            document.getElementById("langSelect").value =
              language === "default" ? response.data.language : language;
        })

        .catch((err) => {
          console.log(err);
          this.setState({
            noErrorLO: false,
            loading: true,
          });
          this.setState({
            videoSource: "",
            videoVtt: "",
            transcript: "",
            summary25: "",
            summary50: "",
            // topicTitle: "",
            currentSummary: "",
            keywords: [],
            loading: true,
            Framelist: {},
            AudioTrackList: {},
            playedLo: {},
          });

          // document.getElementById("cover-spin").style.display = "none"
          // handle err
        });
    } else {
      this.setState({
        videoSource: "",
        videoVtt: "",
        transcript: "",
        summary25: "",
        summary50: "",
        topicTitle: "",
        currentSummary: "",
        keywords: [],
        loading: true,
        Framelist: {},
        AudioTrackList: {},
        playedLo: {},
      });

      // if (this.state.loading)
      //   document.getElementById("cover-spin").style.display = "none"
      this.onSummaryClick("full_transcript");
      //document.getElementById("langSelect").value = language
    }
    // if (this.state.loading)
    //   document.getElementById("cover-spin").style.display = "none"
    this.onSummaryClick("full_transcript");
    // document.getElementById("langSelect").value = language
  }
  //-------------------For description
  updateSummaryCount = () => {
    this.setState({
      keywordsCount: 1,
      notesCount: 1,
      summaryCount: this.state.summaryCount + 1,
    });
  };

  updateKeywordsCount = () => {
    this.setState({
      summaryCount: 1,
      notesCount: 1,
      keywordsCount: this.state.keywordsCount + 1,
    });
  };
  updateNotesCount = () => {
    this.setState({
      keywordsCount: 1,
      summaryCount: 1,
      notesCount: this.state.notesCount + 1,
    });
  };
  onKeywordsClick = () => {
    this.showTextHandler("keywords");
  };

  onNotesClick = () => {
    this.showTextHandler("notes");
  };

  onTranslationClick = (lang, valchk) => {
    document.getElementById("cover-spin").style.display = "";
    this.setState({ selectedLanguage: lang });
    var lo;
    if (this.state.isCoursePlayer) {
      if (this.state.MofId) {
        lo = this.state.MofId;
      } else {
        lo = this.state.los[this.state.selectedvideoIndex];
      }
    } else {
      lo = this.state.toc[this.state.selectedvideoIndex];
    }

    //const loId = this.state.isCoursePlayer ? lo.LOid : lo._id;

    var loId;
    if (this.state.isCoursePlayer) {
      if (this.state.MofId) {
        loId = this.state.MofId;
      } else {
        loId = lo.LOid;
        loId = this.state.LObjID;
      }
    } else {
      loId = lo._id;
    }
    // const language = lo.availableLanguages.find(item => {
    //   return item.languageCode === lang;
    // });

    valchk = document.getElementById("scales").checked;
    var requestString = `${backendURL}/getPlayedLo/${loId}/${lang}`;
    if (valchk) {
      requestString = `${backendURL}/getPlayedLo/${loId}/${lang}/1`;
    } else {
      requestString = `${backendURL}/getPlayedLo/${loId}/${lang}/0`;
    }
    axios
      .get(requestString)
      .then((response) => {
        this.setState({
          videoVtt: response.data.vttSignedUrlarr,
        });

        document.getElementById("cover-spin").style.display = "none";
        if ("frameList" in response.data) {
          document.getElementById("scales").style.visibility = "visible";
          document.getElementById("label10").style.visibility = "visible";
        } else {
          document.getElementById("scales").style.visibility = "hidden";
          document.getElementById("label10").style.visibility = "hidden";
        }

        this.setState({
          selectedLanguage: lang,
          transcript: response.data.transcript,
          summary25: response.data.summary25,
          summary50: response.data.summary50,
          videoVtt: response.data.vttSignedUrl,
          playedLo: response.data,
        });
        // document.getElementById("1010").contentDocument.location.reload(true)
        if (valchk) {
          document.getElementById("1010").contentDocument.location.reload(true);
        } else {
        }

        this.onSummaryClick("full_transcript");
        ///////////////////////////////////////////////
        ////////////////////////////////////

        //////////////////////////////////
        ////////////////////////////
      })
      .catch((error) => {
        document.getElementById("cover-spin").style.display = "none";

        console.log(error);
      });

    // axios
    //   .get(`${backendURL}/getVideoSubtitles/${loId}/${lang}`)
    //   .then(response => {
    //     this.setState({
    //       videoVtt: response.data.vttSignedUrl
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // axios
    //   .get(`${backendURL}/getAudioTrack/${loId}/${lang}`, {
    //      headers: {
    //     Authorization: this.state.Authorization,
    //     IdToken: this.state.IdToken,
    //     TENANT_ID: this.state.TENANT_ID,
    //    },
    //   })
    //   .then((res) => {
    //     this.setState({ audioTrack: res.data })
    //   })
  };
  ///////////2222222222222222222222222222222222222222222///////////////////////

  onTranslationClicknewlang = (lang, valchk) => {
    this.setState({ selectedLanguage: lang });
    var lo;
    if (this.state.isCoursePlayer) {
      if (this.state.MofId) {
        lo = this.state.MofId;
      } else {
        lo = this.state.los[this.state.selectedvideoIndex];
      }
    } else {
      lo = this.state.toc[this.state.selectedvideoIndex];
    }

    var loId;
    if (this.state.isCoursePlayer) {
      if (this.state.MofId) {
        loId = this.state.MofId;
      } else {
        loId = lo.LOid;
        loId = this.state.LObjID;
      }
    } else {
      loId = lo._id;
    }
    if (this.state.isH5p) {
      this.changeVideoSource(loId, lang);
      this.state.updateNavigationCounter();
    } else {
      document.getElementById("cover-spin").style.display = "";

      valchk = document.getElementById("scales").checked;
      var requestString = `${backendURL}/getPlayedLo/${loId}/${lang}`;
      if (valchk) {
        requestString = `${backendURL}/getPlayedLo/${loId}/${lang}/1`;
      } else {
        requestString = `${backendURL}/getPlayedLo/${loId}/${lang}/0`;
      }
      axios
        .get(requestString)
        .then((response) => {
          this.setState({
            videoVtt: response.data.vttSignedUrlarr,
          });

          document.getElementById("cover-spin").style.display = "none";
          if ("frameList" in response.data) {
            document.getElementById("scales").style.visibility = "visible";
            document.getElementById("label10").style.visibility = "visible";
          } else {
            document.getElementById("scales").style.visibility = "hidden";
            document.getElementById("label10").style.visibility = "hidden";
          }

          this.setState({
            selectedLanguage: lang,
            transcript: response.data.transcript,
            summary25: response.data.summary25,
            summary50: response.data.summary50,
            videoVtt: response.data.vttSignedUrl,
            playedLo: response.data,
          });
          //document.getElementById("1010").contentDocument.location.reload(true)

          // window.location.reload()

          this.onSummaryClick("full_transcript");

          // window.location.reload();
        })
        .catch((error) => {
          document.getElementById("cover-spin").style.display = "none";
          window.location.reload();

          console.log(error);
        });
    }
    //document.getElementById("1010").contentDocument.location.reload(true)
  };

  // notes for course player & keywords for lom
  handleOnChange = (value) => {
    // if (this.state.PlayerType) {
    //   this.setState({
    //     studentNotes: evt.editor.getData(),
    //   })
    // } else {
    //   const arr = evt.editor.getData().split("\n")
    //   this.setState({ keywords: [] })
    //   arr.map((item, index) => {
    //     if (item && item !== "&nbsp;")
    //       this.state.keywords.push(item.replace("<p>", "").replace("</p>", ""))
    //   })
    // }
    if (this.state.notesShow) this.setState({ studentNotes: value });
    else if (this.state.transcriptShow)
      this.setState({ currentSummary: value });
  };

  changeLanguage = (language) => {
    this.setState({ selectedLanguage: language });
  };

  handleOnChange2 = (evt) => {
    // const data = evt.editor
    //   .getData()
    //   .replace(new RegExp("<p>", "g"), "")
    //   .replace(new RegExp("<p/>", "g"), "")
    if (this.state.summaryPercent === "25") {
      this.setState({
        summary25: evt.editor.getData(),
      });
    } else if (this.state.summaryPercent === "50") {
      this.setState({
        summary50: evt.editor.getData(),
      });
    } else if (this.state.summaryPercent === "100") {
      this.setState({
        transcript: evt.editor.getData(),
      });
    }
  };

  saveNotes = () => {
    var loIdnote;
    if (this.state.isCoursePlayer) {
      if (this.state.MofId) {
        loIdnote = this.state.MofId;
      } else {
        loIdnote = this.state.los[this.state.selectedvideoIndex].id;
      }
    }

    const id = loIdnote;
    axios
      .post(`${backendURL}/saveStudentNotes/${id}`, {
        notes: this.state.studentNotes,
      })
      .then((res) => {
        this.notify("success", "Success", `Your notes saved successfully.`);
      })
      .catch((err) => {
        console.log(err);
        this.notify("danger", "", `An error occured while saving your notes.`);
      });
  };

  onSummaryClick = (e) => {
    let title = "Transcript 100%";
    this.updateSummaryCount();
    if (e === "Summary_25") {
      this.setState({
        currentSummary: this.state.summary25,
        summaryPercent: "25",
      });
      title = "Summary 25%";
    } else if (e === "Summary_50") {
      this.setState({
        currentSummary: this.state.summary50,
        summaryPercent: "50",
      });
      title = "Summary 50%";
    } else if (e === "full_transcript") {
      this.setState({
        currentSummary: this.state.transcript,
        summaryPercent: "100",
      });
      title = "Transcript 100%";
    }
    this.showTextHandler("transcript", title);
  };
  showTextHandler = (name, title = "") => {
    if (name === "transcript") {
      this.setState({
        transcriptShow: !false,
        KeywordsShow: false,
        notesShow: false,
        title: title,
      });
    } else if (name === "keywords") {
      this.setState({
        transcriptShow: false,
        KeywordsShow: !false,
        notesShow: false,
        title: "Special Keywords",
      });
    } else if (name === "notes") {
      this.setState({
        transcriptShow: false,
        KeywordsShow: false,
        notesShow: !false,
        title: "Notes",
      });
    } else {
      this.setState({ showComponent: false });
    }
  };

  // foo = (playlistobj) => {
  //   let parsejson = JSON.parse(atob(playlistobj))
  //   //This loop will wait for each next() to pass the next iteration
  //   for (var i = 0; i < parsejson.subSubTopics.length; i++) {
  //     axios
  //       .post(
  //         `${backendURL}/translate/ar/en`,
  //         {
  //           text: playlistobj.topics[0].subTopics[0].subSubTopics[i].title,
  //         },
  //         {
  //           headers: {
  //             Authorization: this.state.Authorization,
  //             IdToken: this.state.IdToken,
  //             TENANT_ID: this.state.TENANT_ID,
  //           },
  //         }
  //       )
  //       .then(async (response) => {
  //         playlistobj.topics[0].subTopics[0].subSubTopics[i - 1].title =
  //           response.data
  //       })
  //   }
  // }

  //-----------------------------------End of description

  render() {
    const styleDiv = {
      marginTop: "0",

      marginLeft: "3%",
    };
    if (this.state.noError) {
      if (this.state.loading) {
        return (
          <div className="row mr-0 ">
            <div id="cover-spin" style={{ display: "none" }}></div>
            {/* <ReactNotifications /> */}

            <div
              className="col-12 p-2 bg-white text-danger"
              style={{
                borderTop: "1px solid rgba(0,0,0,.12)",
                borderBottom: "1px solid rgba(0,0,0,.12)",
                padingRight: "5px",
              }}
            >
              <Menu
                onClick={() => {
                  this.setState((prevState) => ({
                    ...prevState,
                    showModal: !prevState.showModal,
                  }));
                }}
              />
              <Button
                className="btn btn-secondary"
                style={{
                  width: "auto",
                  height: "37px",
                  padding: "revert",
                  marginLeft: "15px",
                }}
                // onClick={() => {
                //   if (document.referrer.includes("online.eduedges.com"))
                //     window.history.go(this.state.navigationCounter);
                //   else window.close();
                // }}
              >
                <ArrowBackIos style={{ fontSize: "small" }} />
                Back
              </Button>
              <span>{`${this.state.mainTitle} > ${this.state.subTitle} > ${this.state.topicTitle}`}</span>
            </div>

            <div className="page-content " style={styleDiv}>
              <div className="row" style={{ marginRight: "0" }}>
                <Modal
                  show={this.state.showModal}
                  isCoursePlayer={this.state.isCoursePlayer}
                  toc={this.state.toc}
                  selectedLanguage={this.state.selectedLanguage}
                  urls={this.state.urls}
                  changeVideoSource={this.changeVideoSource.bind(this)}
                  videoSource={this.state.videoSource}
                  data={{ lo: this.state.lo }}
                  handleUrlChange={this.handleUrlChange}
                  changeTopicTitle={this.changeTopicTitle.bind(this)}
                  changeSelectedIndex={this.changeSelectedIndex.bind(this)}
                  topicHeader={this.state.topicTitle}
                  los={this.state.los}
                  selectedListIndex={this.state.selectedListIndex}
                  selectedListIndexChangeHandler={
                    this.selectedListIndexChangeHandler
                  }
                  updateNavigationCounter={this.updateNavigationCounter.bind(
                    this
                  )}
                  // onLanguageSelect={this.onLanguageSelect.bind(this)}
                  changeSelectedVideoIndex={this.changeSelectedVideoIndex}
                  selectedListItemIndex={this.state.selectedListItemIndex}
                  selectedListItemIndexChangeHandler={
                    this.selectedListItemIndexChangeHandler
                  }
                  headers={this.state.headers}
                  nextOrPrev={this.state.nextOrPrev}
                  nextOrPrevHandler={this.nextOrPrevHandler}
                  updateTranscriptCount={this.updateTranscriptCount}
                  onSummaryClick={this.onSummaryClick}
                  changeLanguage={this.changeLanguage.bind(this)}
                />
                {/* {this.state.IsMediaFile === false ? (
                  <div>
                    <LoList
                      isCoursePlayer={this.state.isCoursePlayer}
                      toc={this.state.toc}
                      selectedLanguage={this.state.selectedLanguage}
                      urls={this.state.urls}
                      changeVideoSource={this.changeVideoSource.bind(this)}
                      videoSource={this.state.videoSource}
                      data={{ lo: this.state.lo }}
                      handleUrlChange={this.handleUrlChange}
                      changeTopicTitle={this.changeTopicTitle.bind(this)}
                      changeSelectedIndex={this.changeSelectedIndex.bind(this)}
                      topicHeader={this.state.topicTitle}
                      los={this.state.los}
                      selectedListIndex={this.state.selectedListIndex}
                      selectedListIndexChangeHandler={
                        this.selectedListIndexChangeHandler
                      }
                      updateNavigationCounter={this.updateNavigationCounter.bind(
                        this
                      )}
                      // onLanguageSelect={this.onLanguageSelect.bind(this)}
                      changeSelectedVideoIndex={this.changeSelectedVideoIndex}
                      selectedListItemIndex={this.state.selectedListItemIndex}
                      selectedListItemIndexChangeHandler={
                        this.selectedListItemIndexChangeHandler
                      }
                      headers={this.state.headers}
                      nextOrPrev={this.state.nextOrPrev}
                      nextOrPrevHandler={this.nextOrPrevHandler}
                      updateTranscriptCount={this.updateTranscriptCount}
                      onSummaryClick={this.onSummaryClick}
                      changeLanguage={this.changeLanguage.bind(this)}
                    />
                  </div>
                ) : null} */}

                <div>
                  {
                    //this.state.PlayerType === 2 ? (
                    // <div>
                    //   <VideoCont
                    //     isCoursePlayer={this.state.isCoursePlayer}
                    //     topicTitle={this.state.topicTitle}
                    //     toc={this.state.toc}
                    //     videoVtt={this.state.videoVtt}
                    //     videoSource={this.state.videoSource}
                    //     language={this.state.language}
                    //     previousHandler={this.previousHandler}
                    //     nextHandler={this.nextHandler}
                    //     vtts={this.state.vtts}
                    //     // {this.state.toc[this.state.selectedvideoIndex]}
                    //  />
                    //</div>
                    //  ) : (
                    <div
                      style={{
                        marginTop: this.state.IsMediaFile ? "30px" : "20px",
                        marginLeft:
                          this.state.IsMediaFile || this.state.isH5p
                            ? "50px"
                            : "10px",
                      }}
                    >
                      <PPlayer
                        contentType={this.state.contentType}
                        isH5p={this.state.isH5p}
                        loobjectid={this.state.LObjID}
                        topicTitle={this.state.topicTitle}
                        tocs={this.state.toc}
                        videoVtt={this.state.videoVtt}
                        videoSource={this.state.videoSource}
                        selectedLangName={this.state.selectedLangName}
                        framelist={this.state.Framelist}
                        audiotracklist={this.state.AudioTrackList}
                        IsMediaFile={this.state.IsMediaFile}
                        playedLo={this.state.playedLo}
                        noErrorLO={this.state.noErrorLO}
                        onTranslationClick={this.onTranslationClick}
                        onUpdateCheckbox={this.onUpdateCheckbox}
                        isCoursePlayer={this.state.isCoursePlayer}
                        isNormal={this.state.isNormal}
                        // isurlobject={this.state.isurlobject}
                        playList={this.playlist}
                        previousHandler={this.previousHandler}
                        nextHandler={this.nextHandler}
                      />{" "}
                      <div
                        className="row d-flex justify-content-center"
                        style={{
                          textAlign: "center",
                          display: this.state.MofId ? "none" : "",
                          marginBottom: "15px",
                          marginTop: "5px",
                        }}
                      >
                        {" "}
                        <button
                          className="btn btn-info"
                          style={{
                            marginRight: "5px",
                            width: "30%",
                            fontWeight: "large",
                            display: this.state.MofId ? "none" : "",
                          }}
                          onClick={
                            // const { toc, selectedListItemIndex } = this.state
                            // const list = toc[0].subTopics[0].subSubTopics
                            // let indx = list.findIndex(
                            //   (item) => item.title === selectedListItemIndex
                            // )

                            // if (indx > 0) {
                            //   this.selectedListItemIndexChangeHandler(
                            //     list[indx - 1].title
                            //   )
                            //   this.changeTopicTitle(
                            //     list[indx - 1].title,
                            //     toc[0].subTopics[0].title
                            //   )
                            //   this.changeVideoSource(list[indx - 1].LOid)
                            // }
                            this.previousHandler
                          }
                        >
                          <ArrowBack /> Previous
                        </button>
                        <button
                          className="btn btn-info"
                          style={{
                            marginLeft: "5px",
                            width: "30%",
                            fontWeight: "large",
                            display: this.state.MofId ? "none" : "",
                          }}
                          onClick={
                            this.nextHandler
                            // const { toc, selectedListItemIndex } = this.state
                            // const list = toc[0].subTopics[0].subSubTopics
                            // let indx = list.findIndex(
                            //   (item) => item.title === selectedListItemIndex
                            // )

                            // if (indx === list.length - 1) indx = -1

                            // this.selectedListItemIndexChangeHandler(
                            //   list[indx + 1].title
                            // )
                            // this.changeTopicTitle(
                            //   list[indx + 1].title,
                            //   toc[0].subTopics[0].title
                            // )
                            // this.changeVideoSource(list[indx + 1].LOid)
                          }
                        >
                          Next <ArrowForward />
                        </button>{" "}
                      </div>
                    </div>
                  }
                </div>

                {/* {this.state.teacherMode === false ?*/}
                {this.state.isH5p ||
                this.state.isNormal ||
                (!this.state.transcript &&
                  !this.state.summary25 &&
                  !this.state.summary50 &&
                  this.state.keywords.length === 0) ? null : (
                  <div>
                    <Description
                      isH5p={this.state.isH5p}
                      srcLanguage={this.state.srcLanguage}
                      isCoursePlayer={this.state.isCoursePlayer}
                      IsMediaFile={this.state.IsMediaFile}
                      title={this.state.title}
                      topicTitle={this.state.topicTitle}
                      transcriptShow={this.state.transcriptShow}
                      transcript={this.state.transcript}
                      studentNotes={this.state.studentNotes}
                      handleOnChange={this.handleOnChange}
                      handleOnChange2={this.handleOnChange2}
                      submit={this.submit}
                      summaryShow={this.state.summaryShow}
                      currentSummary={this.state.currentSummary}
                      KeywordsShow={this.state.KeywordsShow}
                      notesShow={this.state.notesShow}
                      keywords={this.state.keywords}
                      onSummaryClick={this.onSummaryClick}
                      onTranslationClick={this.onTranslationClick}
                      onKeywordsClick={this.onKeywordsClick}
                      onNotesClick={this.onNotesClick}
                      updateKeywordsCount={this.updateKeywordsCount}
                      updateNotesCount={this.updateNotesCount}
                      saveNotes={this.saveNotes.bind(this)}
                      availableLanguage={this.state.playedLo.vttSignedUrlarr}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        return <div id="cover-spin" style={{ backgroundColor: "white" }}></div>;
      }
    } else {
      return (
        <div id="main">
          <div class="centered">
            <h1>This lesson is not available yet...</h1>
          </div>
        </div>
      );
    }
  }
}

export default Videoall;
