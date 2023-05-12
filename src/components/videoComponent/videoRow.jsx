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
              <Button
                className="btn btn-secondary"
                style={{
                  width: "auto",
                  height: "37px",
                  padding: "revert",
                  marginLeft: "15px",
                }}
                onClick={() => {
                  // TODO: detect player src changes

                  if (document.referrer.includes("online.eduedges.com"))
                    window.history.go(this.state.navigationCounter);
                  else window.close();

                  // if (window.opener) {
                  //   window.close()
                  // } else if (window.parent) {
                  //   window.history.go(this.state.navigationCounter)
                  // }
                }}
              >
                <ArrowBackIos style={{ fontSize: "small" }} />
                Back
              </Button>
              {/*<select
                className="btn btn-info"
                id="langSelect"
                style={{ marginRight: "10px", marginLeft: "10px" }}
                onChange={(e) => {
                  this.onTranslationClicknewlang(e.target.value)
                }}
                defaultValue={""}
              >
                <option value="" disabled>
                  Translate New Language
                </option>
                {/* <option>Select Language</option> 
                <option value="af">Afrikaans</option>
                <option value="sq">Albanian - shqip</option>
                <option value="am">Amharic - አማርኛ</option>
                <option value="ar">Arabic - العربية</option>
                <option value="an">Aragonese - aragonés</option>
                <option value="hy">Armenian - հայերեն</option>
                <option value="ast">Asturian - asturianu</option>
                <option value="az">Azerbaijani - azərbaycan dili</option>
                <option value="eu">Basque - euskara</option>
                <option value="be">Belarusian - беларуская</option>
                <option value="bn">Bengali - বাংলা</option>
                <option value="bs">Bosnian - bosanski</option>
                <option value="br">Breton - brezhoneg</option>
                <option value="bg">Bulgarian - български</option>
                <option value="ca">Catalan - català</option>
                <option value="ckb">Central Kurdish - کوردی </option>
                <option value="zh">Chinese - 中文</option>
        
                <option value="co">Corsican</option>
                <option value="hr">Croatian - hrvatski</option>
                <option value="cs">Czech - čeština</option>
                <option value="da">Danish - dansk</option>
                <option value="nl">Dutch - Nederlands</option>
                <option value="en">English</option>
                <option value="eo">Esperanto - esperanto</option>
                <option value="et">Estonian - eesti</option>
                <option value="fo">Faroese - føroyskt</option>
                <option value="fil">Filipino</option>
                <option value="fi">Finnish - suomi</option>
                <option value="fr">French - français</option>
                <option value="gl">Galician - galego</option>
                <option value="ka">Georgian - ქართული</option>
                <option value="de">German - Deutsch</option>
                <option value="el">Greek - Ελληνικά</option>
                <option value="gn">Guarani</option>
                <option value="gu">Gujarati - ગુજરાતી</option>
                <option value="ha">Hausa</option>
                <option value="haw">Hawaiian - ʻŌlelo Hawaiʻi</option>
                <option value="he">Hebrew - עברית</option>
                <option value="hi">Hindi - हिन्दी</option>
                <option value="hu">Hungarian - magyar</option>
                <option value="is">Icelandic - íslenska</option>
                <option value="id">Indonesian - Indonesia</option>
                <option value="ia">Interlingua</option>
                <option value="ga">Irish - Gaeilge</option>
                <option value="it">Italian - italiano</option>
                <option value="ja">Japanese - 日本語</option>
                <option value="kn">Kannada - ಕನ್ನಡ</option>
                <option value="kk">Kazakh - қазақ тілі</option>
                <option value="km">Khmer - ខ្មែរ</option>
                <option value="ko">Korean - 한국어</option>
                <option value="ku">Kurdish - Kurdî</option>
                <option value="ky">Kyrgyz - кыргызча</option>
                <option value="lo">Lao - ລາວ</option>
                <option value="la">Latin</option>
                <option value="lv">Latvian - latviešu</option>
                <option value="ln">Lingala - lingála</option>
                <option value="lt">Lithuanian - lietuvių</option>
                <option value="mk">Macedonian - македонски</option>
                <option value="ms">Malay - Bahasa Melayu</option>
                <option value="ml">Malayalam - മലയാളം</option>
                <option value="mt">Maltese - Malti</option>
                <option value="mr">Marathi - मराठी</option>
                <option value="mn">Mongolian - монгол</option>
                <option value="ne">Nepali - नेपाली</option>
                <option value="no">Norwegian - norsk</option>
                <option value="nb">Norwegian Bokmål - norsk bokmål</option>
                <option value="nn">Norwegian Nynorsk - nynorsk</option>
                <option value="oc">Occitan</option>
                <option value="or">Oriya - ଓଡ଼ିଆ</option>
                <option value="om">Oromo - Oromoo</option>
                <option value="ps">Pashto - پښتو</option>
                <option value="fa">Persian - فارسی</option>
                <option value="pl">Polish - polski</option>
                <option value="pt">Portuguese - português</option>
                <option value="pa">Punjabi - ਪੰਜਾਬੀ</option>
                <option value="qu">Quechua</option>
                <option value="ro">Romanian - română</option>
                <option value="rm">Romansh - rumantsch</option>
                <option value="ru">Russian - русский</option>
                <option value="gd">Scottish Gaelic</option>
                <option value="sr">Serbian - српски</option>
                <option value="sh">Serbo-Croatian - Srpskohrvatski</option>
                <option value="sn">Shona - chiShona</option>
                <option value="sd">Sindhi</option>
                <option value="si">Sinhala - සිංහල</option>
                <option value="sk">Slovak - slovenčina</option>
                <option value="sl">Slovenian - slovenščina</option>
                <option value="so">Somali - Soomaali</option>
                <option value="st">Southern Sotho</option>
                <option value="es">Spanish - español</option>
                <option value="su">Sundanese</option>
                <option value="sw">Swahili - Kiswahili</option>
                <option value="sv">Swedish - svenska</option>
                <option value="tg">Tajik - тоҷикӣ</option>
                <option value="ta">Tamil - தமிழ்</option>
                <option value="tt">Tatar</option>
                <option value="te">Telugu - తెలుగు</option>
                <option value="th">Thai - ไทย</option>
                <option value="ti">Tigrinya - ትግርኛ</option>
                <option value="to">Tongan - lea fakatonga</option>
                <option value="tr">Turkish - Türkçe</option>
                <option value="tk">Turkmen</option>
                <option value="tw">Twi</option>
                <option value="uk">Ukrainian - українська</option>
                <option value="ur">Urdu - اردو</option>
                <option value="ug">Uyghur</option>
                <option value="uz">Uzbek - o‘zbek</option>
                <option value="vi">Vietnamese - Tiếng Việt</option>
                <option value="wa">Walloon - wa</option>
                <option value="cy">Welsh - Cymraeg</option>
                <option value="fy">Western Frisian</option>
                <option value="xh">Xhosa</option>
                <option value="yi">Yiddish</option>
                <option value="yo">Yoruba - Èdè Yorùbá</option>
                <option value="zu">Zulu - isiZulu</option>
  </select>*/}
              {this.state.mainTitle}{" "}
              <span className="text-secondary">{">"}</span>{" "}
              {this.state.subTitle}{" "}
              <span className="text-secondary"> {">"}</span>{" "}
              {this.state.topicTitle}{" "}
            </div>

            <div className="page-content " style={styleDiv}>
              <div className="row" style={{ marginRight: "0" }}>
                {this.state.IsMediaFile === false ? (
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
                ) : null}

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
