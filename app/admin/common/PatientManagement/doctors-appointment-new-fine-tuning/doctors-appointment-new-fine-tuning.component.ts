import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { UpdateConsultancyComponent } from "../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";

@Component({
  selector: "app-doctors-appointment-new-fine-tuning",
  templateUrl: "./doctors-appointment-new-fine-tuning.component.html",
  styleUrls: ["./doctors-appointment-new-fine-tuning.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class DoctorsAppointmentNewFineTuningComponent implements OnInit {
  tabIndexToView: number = 0;
  User: any = [];
  userEar: any = [];
  CentreList: any = [];
  AppoID: any;
  Editable: any;
  TestName: any = "Fine_Tuning";
  buttonname: string = "Create";
  buttonValid: boolean = true;
  Spinner: boolean = false;
  EditDetails: any = [];
  Level_1_Status: any = undefined;
  Level_2_Status: any = undefined;
  Level_3_Status: any = undefined;

  // Loudness
  selectedLoudness: any = [];

  SoundsInGeneralSolution: any = [];
  SoundsInGeneralFinalOutcome: any = [];
  SpeechIsTooLoudSolution: any = [];
  SpeechIsTooLoudFinalOutcome: any = [];
  HighFrequencySoundsSolution: any = [];
  HighFrequencySoundsFinalOutcome: any = [];
  LowFrequencySoundsSolution: any = [];
  LowFrequencySoundsFinalOutcome: any = [];
  SoundsOfManyPeopleSolution: any = [];
  SoundsOfManyPeopleFinalOutcome: any = [];
  LoudSoundsSeemDistortedSolution: any = [];
  LoudSoundsSeemDistortedFinalOutcome: any = [];
  SuddenNoisesArePainfullySolution: any = [];
  SuddenNoisesArePainfullyFinalOutcome: any = [];
  AllSoundsAreTooSoftSolution: any = [];
  AllSoundsAreTooSoftFinalOutcome: any = [];
  SoftSoundsAreNotSolution: any = [];
  SoftSoundsAreNotFinalOutcome: any = [];
  SoftSpeechIsNotAudibleSolution: any = [];
  SoftSpeechIsNotAudibleFinalOutcome: any = [];
  SpeechIsTooSoftSolution: any = [];
  SpeechIsTooSoftFinalOutcome: any = [];
  HighFrequencySoundsAreTooSoftSolution: any = [];
  HighFrequencySoundsAreTooSoftFinalOutcome: any = [];
  VolumeControlNeedsSolution: any = [];
  VolumeControlNeedsFinalOutcome: any = [];
  WindNoiseSolution: any = [];
  WindNoiseFinalOutcome: any = [];
  AmbientNoiseSolution: any = [];
  AmbientNoiseFinalOutcome: any = [];

  // Sound Quality

  SelectedSoundQuality: any = [];

  SpeechIsUnclearSolution: any = [];
  SpeechIsUnclearFinalOutcome: any = [];
  SpeechIsBoomySolution: any = [];
  SpeechIsBoomyFinalOutcome: any = [];
  MaleVoicesBoomySolution: any = [];
  MaleVoicesBoomyFinalOutcome: any = [];
  MaleVoicesTinnySolution: any = [];
  MaleVoicesTinnyFinalOutcome: any = [];
  MaleVoicesDullSolution: any = [];
  MaleVoicesDullFinalOutcome: any = [];
  MaleVoicesHollowSolution: any = [];
  MaleVoicesHollowFinalOutcome: any = [];
  MaleVoicesSharpSolution: any = [];
  MaleVoicesSharpFinalOutcome: any = [];
  OwnVoicesSharpSolution: any = [];
  OwnVoicesSharpFinalOutcome: any = [];
  OwnVoicesBarrelSolution: any = [];
  OwnVoicesBarrelFinalOutcome: any = [];
  OwnVoicesStuffingSolution: any = [];
  OwnVoicesStuffingFinalOutcome: any = [];
  OwnVoicesNotAccepctSolution: any = [];
  OwnVoicesNotAccepctFinalOutcome: any = [];
  FemaleVoiceTinnySolution: any = [];
  FemaleVoiceTinnyFinalOutcome: any = [];
  FemaleVoiceDullSolution: any = [];
  FemaleVoiceDullFinalOutcome: any = [];
  FemaleVoiceHollowSolution: any = [];
  FemaleVoiceHollowFinalOutcome: any = [];
  MusicSoundBoomySolution: any = [];
  MusicSoundBoomyFinalOutcome: any = [];
  MusicSoundTinnySolution: any = [];
  MusicSoundTinnyFinalOutcome: any = [];
  MusicSoundDullSolution: any = [];
  MusicSoundDullFinalOutcome: any = [];
  MusicSoundHollowSolution: any = [];
  MusicSoundHollowFinalOutcome: any = [];
  MusicSoundSharpSolution: any = [];
  MusicSoundSharpFinalOutcome: any = [];
  HighFrequencySoundsAreDullSolution: any = [];
  HighFrequencySoundsAreDullFinalOutcome: any = [];

  // Speech Intelligibility
  SelectedSpeechIntelligibility: any = [];

  SpeechIsModerateSolution: any = [];
  SpeechIsModerateFinalOutcome: any = [];
  UnderstandingSpeechSolution: any = [];
  UnderstandingSpeechFinalOutcome: any = [];
  DistanceVoiceSolution: any = [];
  DistanceVoiceFinalOutcome: any = [];
  UnderstandingsSpeakerSolution: any = [];
  UnderstandingsSpeakerFinalOutcome: any = [];
  HearDistanceSpeechSolution: any = [];
  HearDistanceSpeechFinalOutcome: any = [];
  SoundLocalizationSolution: any = [];
  SoundLocalizationFinalOutcome: any = [];
  PoorSpeechPerceptionSolution: any = [];
  PoorSpeechPerceptionFinalOutcome: any = [];
  SoundTurnedDownSolution: any = [];
  SoundTurnedDownFinalOutcome: any = [];
  SoundDistortedSolution: any = [];
  SoundDistortedFinalOutcome: any = [];

  // Feedback
  SelectedFeedback: any = [];

  HearingOccasionallySolution: any = [];
  HearingOccasionallyFinalOutcome: any = [];
  FeedbackOccursSolution: any = [];
  FeedbackOccursFinalOutcome: any = [];
  HearingWhistlesSolution: any = [];
  HearingWhistlesFinalOutcome: any = [];

  // Tinnitus
  SelectedTinnitus: any = [];

  ZENToneSynchronizationSolution: any = [];
  ZENToneSynchronizationFinalOutput: any = [];
  ZENToneSynchronizationKLoudSolution: any = [];
  ZENToneSynchronizationKLoudFinalOutcome: any = [];
  BroadbandStimulationSolution: any = [];
  BroadbandStimulationFinalOutcome: any = [];
  ZENToneWhiteNoiseSolution: any = [];
  ZENToneWhiteNoiseFinalOutcome: any = [];
  ZENToneContinuousStimulationSolution: any = [];
  ZENToneContinuousStimulationFinalOutcome: any = [];
  AmplitudeModulationSolution: any = [];
  AmplitudeModulationFinalOutcome: any = [];
  StimuliBesidesSolution: any = [];
  StimuliBesidesFinalOutcome: any = [];
  TinnitusSeemsWorseSolution: any = [];
  TinnitusSeemsWorseFinalOutcome: any = [];
  PatientRequestingSolution: any = [];
  PatientRequestingFinalOutcome: any = [];
  TSGWhiteNoiseSolution: any = [];
  TSGWhiteNoiseFinalOutcome: any = [];

  // Wireless Accessories
  SelectedWirelessAccessories: any = [];

  MicroMiniMultiNoiseSolution: any = [];
  MicroMiniMultiNoiseFinalOutcome: any = [];
  PhoneClipSolution: any = [];
  PhoneClipFinalOutcome: any = [];

  // Synchronized Functionality
  SelectedSynchronizedFunctionality: any = [];

  functionalityEachEarSolution: any = [];
  functionalityEachEarFinalOutcome: any = [];
  SynchedPushBottomSolution: any = [];
  SynchedPushBottomFinalOutcome: any = [];

  // Physical Fit
  SelectedPhysicalFit: any = [];

  SlipsOutEarSolution: any = [];
  SlipsOutEarFinalOutcome: any = [];
  PainInEarSolution: any = [];
  PainInEarSolutionFinalOutcome: any = [];
  EarpieceInEarSolution: any = [];
  EarpieceInEarFinalOutcome: any = [];

  // HearingAid
  SelectedHearingAid: any = [];

  UsingProgramButtonSolution: any = [];
  UsingProgramButtonFinalOutcome: any = [];
  PreferenceControlSolution: any = [];
  PreferenceControlFinalOutcome: any = [];
  HearingOnOffSolution: any = [];
  HearingOnOffFinalOutcome: any = [];
  ChangingBatteriesSolution: any = [];
  ChangingBatteriesFinalOutcome: any = [];
  ProtectionSystemSolution: any = [];
  ProtectionSystemFinalOutCome: any = [];

  // Others
  SelectedOthers: any = [];

  NoSoundSolution: any = [];
  NoSoundFinalOutcome: any = [];

  // newPrint:any = [];

  @ViewChild("consultancy", { static: false })
  UpdateConsultancy: UpdateConsultancyComponent;
  ObjFineTuning: FineTuning = new FineTuning();

  constructor(
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ActivatedRoute: ActivatedRoute,
    private Header: CompacctHeader,
    private GlobalApi: CompacctGlobalApiService,
    private $CompacctAPI: CompacctCommonApi
  ) {
    this.User = ["Existing User", "New User"];
    this.userEar = ["Right", "Left", "Both"];

    this.ActivatedRoute.queryParams.subscribe((params: any) => {
      this.AppoID = params.Appo_ID;
      // console.log('Appo_ID', this.AppoID);
      this.Editable = params.ed;
      // console.log('Editable',this.Editable);

      // console.log('params',params);
      if (this.Editable == "y") {
        this.editData();
      }
    });
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "FINE TUNING",
      Link: " Patient Management -> FINE TUNING",
    });

    this.getCenterList();
    this.getDataAgainstAppoId();
  }

  updateConsultancysave(event) {
    this.Level_1_Status = event.Level_1_Status;
    this.Level_2_Status = event.Level_2_Status;
    this.Level_3_Status = event.Level_3_Status;
  }

  saveDocAppo(valid: any) {
// this.newPrint = [
//   {
//     Topic:'Loudness',
//     S1: this.selectedLoudness[0],


//    },
//    ];
//     this.ObjFineTuning.prints = this.newPrint;

    this.ObjFineTuning.Appo_ID = this.AppoID;
    this.ObjFineTuning.Posted_By = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjFineTuning.Posted_On = this.DateService.dateConvert(new Date());
    // 10 CheckBoxes
    this.ObjFineTuning.selected_Loudness = this.selectedLoudness;
    this.ObjFineTuning.Selected_Sound_Quality = this.SelectedSoundQuality;
    this.ObjFineTuning.Selected_Speech_Intelligibility =
    this.SelectedSpeechIntelligibility;
    this.ObjFineTuning.Selected_Feedback = this.SelectedFeedback;
    this.ObjFineTuning.Selected_Tinnitus = this.SelectedTinnitus;
    this.ObjFineTuning.Selected_Wireless_Accessories =
    this.SelectedWirelessAccessories;
    this.ObjFineTuning.Selected_Synchronized_Functionality =
    this.SelectedSynchronizedFunctionality;
    this.ObjFineTuning.Selected_PhysicalFit = this.SelectedPhysicalFit;
    this.ObjFineTuning.Selected_HearingAid = this.SelectedHearingAid;
    this.ObjFineTuning.Selected_Others = this.SelectedOthers;

    const TempObj = this.ObjFineTuning;
    const tempSaveJ2 = {
      Appo_ID: this.AppoID,
    };
    const tempSaveJ3 = {
      Test_Name: this.TestName,
    };
    if (valid) {
      console.log('1st save',this.ObjFineTuning);
      this.Spinner = true;
      const obj = {
        SP_String: "SP_BL_Txn_Doctor_Appo_ALL",
        Report_Name_String: "Create_BL_Txn_Doctors_Appo_Test",
        Json_Param_String: JSON.stringify(TempObj),
        Json_2_String: JSON.stringify(tempSaveJ2),
        Json_1_String: JSON.stringify([]),
        Json_3_String: JSON.stringify(tempSaveJ3),
      };
      this.GlobalApi.postData(obj).subscribe((data: any) => {
        // console.log('1st save response',data);
        if (data[0].Column1) {
          // console.log("1st save", data);
          this.saveStatus();
        } else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured ",
          });
        }
      });
    }
  }

  saveStatus() {
    const TempObj2 = {
      Appo_ID: this.AppoID,
      Level_1_Status: this.Level_1_Status,
      Level_2_Status: this.Level_2_Status,
      Level_3_Status: this.Level_3_Status,
    };
    const obj2 = {
      SP_String: "sp_DoctorsAppointmentNew",
      Report_Name_String: "Update_Consultancy_Done",
      Json_Param_String: JSON.stringify(TempObj2),
    };
    // console.log('2nd save', TempObj2);
    this.GlobalApi.postData(obj2).subscribe((data: any) => {
      // console.log("2nd save response", data);
      var msg = this.Editable ? "update" : "create";
      if (data[0].Column1) {
        this.Spinner = false;
        this.buttonValid = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Appointment " + msg,
          detail: "Succesfully",
        });
        if (this.Editable != "y") {
          this.clearData();
          this.UpdateConsultancy.clearComData();
        }
      } else {
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "Error occured ",
        });
      }
    });
  }

  editData() {
    // console.log('edit works');
    this.buttonname = "Update";

    const TempEditObj = {
      Appo_ID: this.AppoID,
    };
    const Editobj = {
      SP_String: "SP_BL_Txn_Doctor_Appo_ALL",
      Report_Name_String: "Retrieve_BL_Txn_Doctor_Appo_ALL_Data",
      Json_Param_String: JSON.stringify(TempEditObj),
    };
    this.GlobalApi.getData(Editobj).subscribe((data: any) => {
      console.log(data);
      this.EditDetails = JSON.parse(data[3].Test_Details);

      // console.log("1st edit data", this.EditDetails);

      this.ObjFineTuning = this.EditDetails;

      this.selectedLoudness = this.EditDetails.selected_Loudness;
      this.SelectedSoundQuality = this.EditDetails.Selected_Sound_Quality;
      this.SelectedSpeechIntelligibility =this.EditDetails.Selected_Speech_Intelligibility;
      this.SelectedFeedback = this.EditDetails.Selected_Feedback;
      this.SelectedTinnitus = this.EditDetails.Selected_Tinnitus;
      this.SelectedWirelessAccessories = this.EditDetails.Selected_Wireless_Accessories;
      this.SelectedSynchronizedFunctionality = this.EditDetails.Selected_Synchronized_Functionality;
      this.SelectedPhysicalFit = this.EditDetails.Selected_PhysicalFit;
      this.SelectedHearingAid = this.EditDetails.Selected_HearingAid;
      this.SelectedOthers = this.EditDetails.Selected_Others;

      this.maxSelectionFeedback();
      this.maxSelectionHearing();
      this.maxSelectionLoudness();
      this.maxSelectionOthers();
      this.maxSelectionPhysicalFit();
      this.maxSelectionSound();
      this.maxSelectionSpeech();
      this.maxSelectionSynchronized();
      this.maxSelectionTinnitus();
      this.maxSelectionWireless();

      // this.ObJ.abc= this.EditDataList.abc ? this.EditDataList.abc : undefined;

      

      this.editData2();
      // for dropdowns
    });
  }
  editData2() {
    const TempDropdownObj = {
      Appo_ID: this.AppoID,
    };

    const Dropdownobj = {
      SP_String: "SP_BL_Txn_Doctor_Appo_ABR",
      Report_Name_String: "Get_All_Data",
      Json_Param_String: JSON.stringify([TempDropdownObj]),
    };
    this.GlobalApi.getData(Dropdownobj).subscribe((data: any) => {
      //  console.log("GetAllDataAppoID For dropdown",data);
      // console.log('2nd edit data', data);
      if (data.length) {
        const editObj = {
          Level_1_Status: data[0].Level_1_Status.toString()
            ? data[0].Level_1_Status.toString()
            : "",
          Level_2_Status: data[0].Level_2_Status.toString()
            ? data[0].Level_2_Status.toString()
            : "",
          Level_3_Status: data[0].Level_3_Status.toString()
            ? data[0].Level_3_Status.toString()
            : "",
        };
        this.UpdateConsultancy.editConsulyancy(editObj);
      }
    });
  }

  clearData() {
    // console.log('clear data works');
    this.ObjFineTuning = new FineTuning();
    this.selectedLoudness = [];
    this.SelectedSoundQuality = [];
    this.SelectedSpeechIntelligibility = [];
    this.SelectedFeedback = [];
    this.SelectedTinnitus = [];
    this.SelectedWirelessAccessories = [];
    this.SelectedSynchronizedFunctionality = [];
    this.SelectedPhysicalFit = [];
    this.SelectedHearingAid = [];
    this.SelectedOthers = [];
    this.getDataAgainstAppoId();
  }

  maxSelectionLoudness() {
    // console.log('selection works');
    if (this.selectedLoudness.length <= 3) {
      this.SoundsInGeneralSolution = [];
      this.SoundsInGeneralFinalOutcome = [];
      this.SpeechIsTooLoudSolution = [];
      this.SpeechIsTooLoudFinalOutcome = [];
      this.HighFrequencySoundsSolution = [];
      this.HighFrequencySoundsFinalOutcome = [];
      this.LowFrequencySoundsSolution = [];
      this.LowFrequencySoundsFinalOutcome = [];
      this.SoundsOfManyPeopleSolution = [];
      this.SoundsOfManyPeopleFinalOutcome = [];
      this.LoudSoundsSeemDistortedSolution = [];
      this.LoudSoundsSeemDistortedFinalOutcome = [];
      this.SuddenNoisesArePainfullySolution = [];
      this.SuddenNoisesArePainfullyFinalOutcome = [];
      this.AllSoundsAreTooSoftSolution = [];
      this.AllSoundsAreTooSoftFinalOutcome = [];
      this.SoftSoundsAreNotSolution = [];
      this.SoftSoundsAreNotFinalOutcome = [];
      this.SoftSpeechIsNotAudibleSolution = [];
      this.SoftSpeechIsNotAudibleFinalOutcome = [];
      this.SpeechIsTooSoftSolution = [];
      this.SpeechIsTooSoftFinalOutcome = [];
      this.HighFrequencySoundsAreTooSoftSolution = [];
      this.HighFrequencySoundsAreTooSoftFinalOutcome = [];
      this.VolumeControlNeedsSolution = [];
      this.VolumeControlNeedsFinalOutcome = [];
      this.WindNoiseSolution = [];
      this.WindNoiseFinalOutcome = [];
      this.AmbientNoiseSolution = [];
      this.AmbientNoiseFinalOutcome = [];

      for (let i = 0; i < this.selectedLoudness.length; i++) {
        if (this.selectedLoudness[i] == "Sounds_in_general_are_too_loud") {
          this.SoundsInGeneralSolution = ["Decrease overall gain"];
          this.SoundsInGeneralFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.Sounds_In_General_Solution=undefined;
          this.ObjFineTuning.Sounds_In_General_FinalOutCome=undefined;
        }

        if (
          this.selectedLoudness[i] == "Speech_is_too_loud_(speaker_is_too_loud)"
        ) {
          this.SpeechIsTooLoudSolution = [
            "Decrease overall gain for mid frequencies (-3dB)",
            "Decrease overall gain",
          ];
          this.SpeechIsTooLoudFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.Speech_Is_TooLoud_Solution=undefined;
          this.ObjFineTuning.Speech_Is_TooLoud_FinalOutcome=undefined;
          }
        if (
          this.selectedLoudness[i] ==
          "High_frequency_sounds_are_too_loud_(dishes,_rattling,_paper_rustling,_water_running)"
        ) {
          this.HighFrequencySoundsSolution = [
            "Decrease mid and high frequency gains for loud sounds",
            "Decrease overall gain",
          ];
          this.HighFrequencySoundsFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.HighFrequency_Sounds_Solution=undefined;
          this.ObjFineTuning.HighFrequency_Sounds_FinalOutcome=undefined;
          }
        if (
          this.selectedLoudness[i] ==
          "Low_frequency_sounds_are_too_loud_(toilet_flushing,_road_noise,_fans,_etc.)"
        ) {
          this.LowFrequencySoundsSolution = [
            "Increase the level of noise reduction",
            "Decrease low and mid frequency gains",
            "Decrease level of Low frequency boost",
          ];
          this.LowFrequencySoundsFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.LowFrequency_Sounds_Solution=undefined;
          this.ObjFineTuning.LowFrequency_Sounds_FinalOutcome=undefined;
          }
        if (
          this.selectedLoudness[i] ==
          "The_sounds_of_many_people_talking_are_too_loud"
        ) {
          this.SoundsOfManyPeopleSolution = [
            "Increase the degree of noise reduction",
            "Decrease low frequency gains for loud sounds",
          ];
          this.SoundsOfManyPeopleFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.SoundsOfMany_People_Solution=undefined;
          this.ObjFineTuning.SoundsOfMany_People_FinalOutcome=undefined;
          }
        if (this.selectedLoudness[i] == "Loud_sounds_seem_distorted") {
          this.LoudSoundsSeemDistortedSolution = [
            "Decrease MPO",
            "Increase MPO",
            "Increase gain for loud input levels in all frequency regions",
          ];
          this.LoudSoundsSeemDistortedFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.LoudSoundsSeem_Distorted_Solution=undefined;
          this.ObjFineTuning.LoudSoundsSeem_Distorted_FinalOutcome=undefined;
          }
        if (this.selectedLoudness[i] == "Sudden_noises_are_painfully_loud") {
          this.SuddenNoisesArePainfullySolution = [
            "Reduce the maximum output level in the high frequencies",
          ];
          this.SuddenNoisesArePainfullyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.SuddenNoisesAre_Painfully_Solution=undefined;
          this.ObjFineTuning.SuddenNoisesAre_Painfully_FinalOutcome=undefined;
          }
        if (this.selectedLoudness[i] == "All_sounds_are_too_soft") {
          this.AllSoundsAreTooSoftSolution = [
            "Increase overall gain",
            "Increase low and mid frequency gain",
          ];
          this.AllSoundsAreTooSoftFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.selectedLoudness[i] ==
          "Soft_sounds_are_not_audible_in_quite_surroundings"
        ) {
          this.SoftSoundsAreNotSolution = [
            "Increase gain for soft input level in all frequency region",
            "Increase gain for soft and moderate input levels",
          ];
          this.SoftSoundsAreNotFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.AllSoundsAre_TooSoft_Solution=undefined;
          this.ObjFineTuning.AllSoundsAre_TooSoft_FinalOutcome=undefined;
          }
        if (this.selectedLoudness[i] == "Soft_speech_is_not_audible") {
          this.SoftSpeechIsNotAudibleSolution = [
            "Increase gain for soft input level",
          ];
          this.SoftSpeechIsNotAudibleFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.SoftSounds_AreNot_Solution=undefined;
          this.ObjFineTuning.SoftSounds_AreNot_FinalOutcome=undefined;
          }
        if (this.selectedLoudness[i] == "Speech_is_Too_Soft") {
          this.SpeechIsTooSoftSolution = [
            "Increase gain for speech in the mid-frequency region",
            "Increase overall gain",
          ];
          this.SpeechIsTooSoftFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.SoftSpeechIsNot_Audible_Solution=undefined;
          this.ObjFineTuning.SoftSpeechIsNot_Audible_FinalOutcome=undefined;
          }
        if (
          this.selectedLoudness[i] ==
          "High_frequency_sounds_are_too_soft_(birdsong,_doorbell,_telephone_ring)"
        ) {
          this.HighFrequencySoundsAreTooSoftSolution = [
            "Increase level of sound shaper ",
          ];
          this.HighFrequencySoundsAreTooSoftFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.SpeechIs_TooSoft_Solution=undefined;
          this.ObjFineTuning.SpeechIs_TooSoft_FinalOutcome=undefined;
          }
        if (
          this.selectedLoudness[i] == "Volume_control_needs_frequent_adjustment"
        ) {
          this.VolumeControlNeedsSolution = [
            "Increase overall gain",
            "Decrease overall gain",
          ];
          this.VolumeControlNeedsFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        else{
          this.ObjFineTuning.HighFrequencySounds_AreTooSoft_Solution=undefined;
          this.ObjFineTuning.HighFrequencySounds_AreTooSoft_FinalOutcome=undefined;
          }
        if (this.selectedLoudness[i] == "Wind_noise_is_too_loud") {
          this.WindNoiseSolution = [
            "Increase wind guard setting",
            "Turn Wind Guard feature on",
          ];
          this.WindNoiseFinalOutcome = ["Found Ok", "Not Checked", "Resolved"];
        }
        if (
          this.selectedLoudness[i] ==
          "Ambient_noise_is_too_noticeable_in_quite_surroundings"
        ) {
          this.AmbientNoiseSolution = [
            "Decrease gain for soft input levels in all frequency region",
            "Decrease gain for soft input level",
          ];
          this.AmbientNoiseFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.selectedLoudness.pop();
    }
  }

  maxSelectionSound() {
    // console.log('selection works');
    if (this.SelectedSoundQuality.length <= 3) {
      this.SpeechIsUnclearSolution = [];
      this.SpeechIsUnclearFinalOutcome = [];
      this.SpeechIsBoomySolution = [];
      this.SpeechIsBoomyFinalOutcome = [];
      this.MaleVoicesBoomySolution = [];
      this.MaleVoicesBoomyFinalOutcome = [];
      this.MaleVoicesTinnySolution = [];
      this.MaleVoicesTinnyFinalOutcome = [];
      this.MaleVoicesDullSolution = [];
      this.MaleVoicesDullFinalOutcome = [];
      this.MaleVoicesHollowSolution = [];
      this.MaleVoicesHollowFinalOutcome = [];
      this.MaleVoicesSharpSolution = [];
      this.MaleVoicesSharpFinalOutcome = [];
      this.OwnVoicesSharpSolution = [];
      this.OwnVoicesSharpFinalOutcome = [];
      this.OwnVoicesBarrelSolution = [];
      this.OwnVoicesBarrelFinalOutcome = [];
      this.OwnVoicesStuffingSolution = [];
      this.OwnVoicesStuffingFinalOutcome = [];
      this.OwnVoicesNotAccepctSolution = [];
      this.OwnVoicesNotAccepctFinalOutcome = [];
      this.FemaleVoiceTinnySolution = [];
      this.FemaleVoiceTinnyFinalOutcome = [];
      this.FemaleVoiceDullSolution = [];
      this.FemaleVoiceDullFinalOutcome = [];
      this.FemaleVoiceHollowSolution = [];
      this.FemaleVoiceHollowFinalOutcome = [];
      this.MusicSoundBoomySolution = [];
      this.MusicSoundBoomyFinalOutcome = [];
      this.MusicSoundTinnySolution = [];
      this.MusicSoundTinnyFinalOutcome = [];
      this.MusicSoundDullSolution = [];
      this.MusicSoundDullFinalOutcome = [];
      this.MusicSoundHollowSolution = [];
      this.MusicSoundHollowFinalOutcome = [];
      this.MusicSoundSharpSolution = [];
      this.MusicSoundSharpFinalOutcome = [];
      this.HighFrequencySoundsAreDullSolution = [];
      this.HighFrequencySoundsAreDullFinalOutcome = [];

      for (let i = 0; i < this.SelectedSoundQuality.length; i++) {
        if (this.SelectedSoundQuality[i] == "Speech_is_unclear_muffled") {
          this.SpeechIsUnclearSolution = [
            "Increase gain for speech in the mid and high frequency regions",
            "Increase overall gain for speech in the mid and high frequency regions",
            "Decrease gain for speech in the low frequency region",
          ];
          this.SpeechIsUnclearFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Speech_is_boomy_or_has_an_echo") {
          this.SpeechIsBoomySolution = [
            "Decrease gain for speech in the mid and high frequency regions",
            "Decrease overall gain for speech in the mid and high frequency regions",
            "Decrease gain for speech in the low frequency region",
            "Increase high level compression",
          ];
          this.SpeechIsBoomyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Male_voices_sound_boomy") {
          this.MaleVoicesBoomySolution = [
            "Decrease gain for low frequencies",
            "Decrease overall gain for low frequency sounds and increase overall gain for high frequency sound",
          ];
          this.MaleVoicesBoomyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSoundQuality[i] == "Male_voices_sound_tinny_or_metallic"
        ) {
          this.MaleVoicesTinnySolution = ["Decrease gain for high frequencies"];
          this.MaleVoicesTinnyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Male_voices_sound_dull") {
          this.MaleVoicesDullSolution = [
            "Increase gain for mid & high frequency sounds",
            "Increase gain for high frequency sounds",
            "Decrease gain for mid & high frequency sounds",
            "Decrease gain for low & mid frequency sounds and increase gain for high frequency sounds",
          ];
          this.MaleVoicesDullFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Male_voices_sound_hollow") {
          this.MaleVoicesHollowSolution = ["Decrease low frequency gain"];
          this.MaleVoicesHollowFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Male_voices_sound_sharp") {
          this.MaleVoicesSharpSolution = [
            "Decrease gain for high frequency sounds",
            "Increase gain for low frequency sounds",
          ];
          this.MaleVoicesSharpFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Own_voices_sound_sharp") {
          this.OwnVoicesSharpSolution = ["Decrease high frequency gain"];
          this.OwnVoicesSharpFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSoundQuality[i] ==
          "Own_voice_sounds_as_if_speaking_in_a_barrel_or_has_an_echo"
        ) {
          this.OwnVoicesBarrelSolution = [
            "Decrease gain in the low frequency region",
            "Decrease gain for speech in mid & high frequency regions",
            "Decrease overall gain in the mid & high frequency regions",
          ];
          this.OwnVoicesBarrelFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSoundQuality[i] ==
          "Own_voice_sounds_stuffed_up_or_closed"
        ) {
          this.OwnVoicesStuffingSolution = [
            "Increase gain for normal and loud input levels",
            "Increase overall gain for all frequency regions",
          ];
          this.OwnVoicesStuffingFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Own_voice_is_not_acceptable") {
          this.OwnVoicesNotAccepctSolution = [
            "Increase vent size, and redo fitting measurements",
          ];
          this.OwnVoicesNotAccepctFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSoundQuality[i] ==
          "Female_voices_sound_tinny_or_metallic"
        ) {
          this.FemaleVoiceTinnySolution = [
            "Increase gain for low and mid frequencies",
          ];
          this.FemaleVoiceTinnyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Female_voices_sound_dull") {
          this.FemaleVoiceDullSolution = [
            "Increase overall gain for mid and high frequencies",
          ];
          this.FemaleVoiceDullFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Female_voices_sound_hollow") {
          this.FemaleVoiceHollowSolution = ["Decrease low frequency gain"];
          this.FemaleVoiceHollowFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Music_sound_boomy") {
          this.MusicSoundBoomySolution = [
            "Decrease low frequency gain by 6 dB, increase high frequency gain",
            "Decrease low frequency gain, increase high frequency gain",
          ];
          this.MusicSoundBoomyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Music_sound_tinny_or_metallic") {
          this.MusicSoundTinnySolution = [
            "Decrease mid and high frequency gain",
            "Reduce the level of noise reduction",
            "Set DFS ultra to Music mode",
          ];
          this.MusicSoundTinnyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Music_sound_dull") {
          this.MusicSoundDullSolution = [
            "Reduce the level of noise reduction",
            "Disable Sound Shaper",
          ];
          this.MusicSoundDullFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Music_sound_hollow") {
          this.MusicSoundHollowSolution = [
            "Increase low and mid frequency gain",
            "Ensure microphone setting is omni direction",
          ];
          this.MusicSoundHollowFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Music_sound_sharp") {
          this.MusicSoundSharpSolution = [
            "Increase low frequency gain and decrease mid and high frequency gain",
          ];
          this.MusicSoundSharpFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "High_frequency_sounds_are_dull") {
          this.HighFrequencySoundsAreDullSolution = [
            "Decrease level of sound shaper",
          ];
          this.HighFrequencySoundsAreDullFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedSoundQuality.pop();
    }
  }

  maxSelectionSpeech() {
    // console.log('selection works');
    if (this.SelectedSpeechIntelligibility.length <= 3) {
      this.SpeechIsModerateSolution = [];
      this.SpeechIsModerateFinalOutcome = [];

      this.UnderstandingSpeechSolution = [];
      this.UnderstandingSpeechFinalOutcome = [];

      this.DistanceVoiceSolution = [];
      this.DistanceVoiceFinalOutcome = [];

      this.UnderstandingsSpeakerSolution = [];
      this.UnderstandingsSpeakerFinalOutcome = [];

      this.HearDistanceSpeechSolution = [];
      this.HearDistanceSpeechFinalOutcome = [];

      this.SoundLocalizationSolution = [];
      this.SoundLocalizationFinalOutcome = [];

      this.PoorSpeechPerceptionSolution = [];
      this.PoorSpeechPerceptionFinalOutcome = [];

      this.SoundTurnedDownSolution = [];
      this.SoundTurnedDownFinalOutcome = [];

      this.SoundDistortedSolution = [];
      this.SoundDistortedFinalOutcome = [];

      for (let i = 0; i < this.SelectedSpeechIntelligibility.length; i++) {
        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Speech_is_unclear_in_moderate_background_noise"
        ) {
          this.SpeechIsModerateSolution = [
            "Increase gain for speech in the mid frequencies",
            "Increase gain for loud input levels in all frequency regions",
          ];
          this.SpeechIsModerateFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Understanding_speech_when_in_a_car,_train,_airplane,_etc._is_difficult"
        ) {
          this.UnderstandingSpeechSolution = [
            "Increase noise reduction setting",
            "When possible, consider the use of the Micro, Mini, or Multi Mic",
          ];
          this.UnderstandingSpeechFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Distance_voices_sounds_seem_louder_than_voices_sounds_nearby"
        ) {
          this.DistanceVoiceSolution = [
            "Increase gain for normal input levels",
            "Increase gain for moderately loud input levels",
            "Decrease gain for soft input levels",
          ];
          this.DistanceVoiceFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Understanding_a_speaker_who_is_far_away_is_difficult"
        ) {
          this.UnderstandingsSpeakerSolution = [
            "Increase mid and high frequency gain",
            "When possible, consider the use of the DEX devices",
          ];
          this.UnderstandingsSpeakerFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Hear_distance_speech_better_than_close_speech"
        ) {
          this.HearDistanceSpeechSolution = [
            "When possible, consider the use of the Micro, Mini, or Multi Mic",
          ];
          this.HearDistanceSpeechFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Sound_localization_is_difficult"
        ) {
          this.SoundLocalizationSolution = [
            "Increase overall for soft sounds",
            "Ensure there is loudness balance between the ears",
          ];
          this.SoundLocalizationFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Poor_speech_perception_in_noise_(raised_speech_seems_muffled_or_dampened)"
        ) {
          this.PoorSpeechPerceptionSolution = [
            "Increase gain for speech in mid frequencies",
            "Increase gain for loud input levels in all frequencies",
          ];
          this.PoorSpeechPerceptionFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Sound_is_turned_down_too_much_in_noisy_environments"
        ) {
          this.SoundTurnedDownSolution = [
            "Increase gain for loud input levels in all frequency regions",
            "Increase gain for normal and loud input level",
          ];
          this.SoundTurnedDownFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSpeechIntelligibility[i] ==
          "Sound_is_distorted_or_very_uncomfortable_in_noisy_environments"
        ) {
          this.SoundDistortedSolution = [
            "Decrease gain for loud input levels in all frequency regions",
            "Decrease MPO",
          ];
          this.SoundDistortedFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedSpeechIntelligibility.pop();
    }
  }
  maxSelectionFeedback() {
    // console.log('selection works');
    if (this.SelectedFeedback.length <= 3) {
      this.HearingOccasionallySolution = [];
      this.HearingOccasionallyFinalOutcome = [];

      this.FeedbackOccursSolution = [];
      this.FeedbackOccursFinalOutcome = [];

      this.HearingWhistlesSolution = [];
      this.HearingWhistlesFinalOutcome = [];

      for (let i = 0; i < this.SelectedFeedback.length; i++) {
        if (
          this.SelectedFeedback[i] ==
          "Hearing_aid_whistles_occasionally,_e.g._when_hugging_a_person,_putting_on_a_hat_or_while_chewing"
        ) {
          this.HearingOccasionallySolution = [
            "Perform feedback test/Calibration",
            "Set feedback cancellation mode to superGain fast to minimize the risk of occasional feedback",
            "Reduce the vent size, or make a new impression of the ear canal to change the shell of the hearing aid",
            "Instruct patient how to place hearing aid or ear piece correctly",
            "Instruct patient in how and when to use controls",
            "Inspect ear and remove cerumen if necessary",
          ];
          this.HearingOccasionallyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedFeedback[i] ==
          "Feedback_occurs_with_the_use_of_the_telephone_and_or_other_dynamic_situations"
        ) {
          this.FeedbackOccursSolution = [
            "Re calibrate DFS ultra/Feedback test",
            "Increase the level of DFS Ultra",
          ];
          this.FeedbackOccursFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedFeedback[i] == "Hearing_aid_whistles_unprovoked") {
          this.HearingWhistlesSolution = [
            "Perform feedback test/Calibration",
            "Reduce the vent size, or make a new impression of the ear canal to change the shell of the hearing aid",
            "Instruct patient how to place hearing aid or ear piece correctly",
            "Instruct patient in how and when to use controls",
            "Inspect ear and remove cerumen if necessary",
          ];
          this.HearingWhistlesFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedFeedback.pop();
    }
  }

  maxSelectionTinnitus() {
    if (this.SelectedTinnitus.length <= 3) {
      this.ZENToneSynchronizationSolution = [];
      this.ZENToneSynchronizationFinalOutput = [];

      this.ZENToneSynchronizationKLoudSolution = [];
      this.ZENToneSynchronizationKLoudFinalOutcome = [];

      this.BroadbandStimulationSolution = [];
      this.BroadbandStimulationFinalOutcome = [];

      this.ZENToneWhiteNoiseSolution = [];
      this.ZENToneWhiteNoiseFinalOutcome = [];

      this.ZENToneContinuousStimulationSolution = [];
      this.ZENToneContinuousStimulationFinalOutcome = [];

      this.AmplitudeModulationSolution = [];
      this.AmplitudeModulationFinalOutcome = [];

      this.StimuliBesidesSolution = [];
      this.StimuliBesidesFinalOutcome = [];

      this.TinnitusSeemsWorseSolution = [];
      this.TinnitusSeemsWorseFinalOutcome = [];

      this.PatientRequestingSolution = [];
      this.PatientRequestingFinalOutcome = [];

      this.TSGWhiteNoiseSolution = [];
      this.TSGWhiteNoiseFinalOutcome = [];

      for (let i = 0; i < this.SelectedTinnitus.length; i++) {
        if (
          this.SelectedTinnitus[i] ==
          "ZEN_tone_TSG_synchronization_white_noise_is_too_soft"
        ) {
          this.ZENToneSynchronizationSolution = [
            "Adjust volume slider",
            "Turn off environmental steering and use volume control to adjust",
          ];
          this.ZENToneSynchronizationFinalOutput = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedTinnitus[i] ==
          "ZEN_tone_TSG_synchronization_white_noise_is_too_loud"
        ) {
          this.ZENToneSynchronizationKLoudSolution = [
            "Adjust volume slider",
            "Turn off environmental steering and use volume control to adjust",
          ];
          this.ZENToneSynchronizationKLoudFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedTinnitus[i] == "Broadband_stimulation_is_not_effective"
        ) {
          this.BroadbandStimulationSolution = [
            "Shape the high/low cut frequency band accordingly",
            "Shape the band for more high frequency emphasis",
            "Active amplitude modulation",
            "Change the stimulus to nature sounds",
            "Stream preferred sounds using wireless device or accessories",
          ];
          this.BroadbandStimulationFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedTinnitus[i] ==
          "ZEN_tone_White_noise_is_not_effectively_interacting_with_the_tinnitus"
        ) {
          this.ZENToneWhiteNoiseSolution = [
            "Stream preferred sounds using wireless device or accessories",
            "Active amplitude modulation",
          ];
          this.ZENToneWhiteNoiseFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedTinnitus[i] ==
          "ZEN_tone_Continuous_stimulation_is_bothersome"
        ) {
          this.ZENToneContinuousStimulationSolution = [
            "Change the stimulus to nature sounds/different ZEN tones",
            "Stream preferred sounds using wireless device or accessories",
          ];
          this.ZENToneContinuousStimulationFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedTinnitus[i] == "Amplitude_modulation_is_bothersome") {
          this.AmplitudeModulationSolution = [
            "De-active amplitude modulation",
            "Synch amplitude modulation",
          ];
          this.AmplitudeModulationFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedTinnitus[i] ==
          "Other_stimuli_besides_ZEN_tone_white_noise_are_helpful"
        ) {
          this.StimuliBesidesSolution = [
            "Use the TSG+Mic /ZEN+Mic setting to allow other stimuli to be present",
          ];
          this.StimuliBesidesFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (this.SelectedTinnitus[i] == "Tinnitus_seems_worse") {
          this.TinnitusSeemsWorseSolution = [
            "Lower the TSG volume/ ZEN tone",
            "Provide additional counselling",
            "Refer to medical evaluation when appropriate",
          ];
          this.TinnitusSeemsWorseFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedTinnitus[i] ==
          "The_patient_is_requesting_an_automatic_volume_control_adjustment_for_TSG"
        ) {
          this.PatientRequestingSolution = ["Activate environmental steering"];
          this.PatientRequestingFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedTinnitus[i] ==
          "ZEN_tone_TSG_white_noise_interferes_with_speech"
        ) {
          this.TSGWhiteNoiseSolution = [
            "Decrease the ZEN/TSG volume",
            "Activate environmental steering",
          ];
          this.TSGWhiteNoiseFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedTinnitus.pop();
    }
  }

  maxSelectionWireless() {
    // console.log('selection works');
    if (this.SelectedWirelessAccessories.length <= 3) {
      this.MicroMiniMultiNoiseSolution = [];
      this.MicroMiniMultiNoiseFinalOutcome = [];

      this.PhoneClipSolution = [];
      this.PhoneClipFinalOutcome = [];

      for (let i = 0; i < this.SelectedWirelessAccessories.length; i++) {
        if (
          this.SelectedWirelessAccessories[i] ==
          "Micro_Mini_Multi_mic_is_too_noisy"
        ) {
          this.MicroMiniMultiNoiseSolution = [
            "Have speaker place microphone closer to their mouth",
            "Make certain the Micro, Mini, or multi mic is not covered by clothing",
            "Change the microphone streaming balance",
          ];
          this.MicroMiniMultiNoiseFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedWirelessAccessories[i] ==
          "Phone_clip_is_not_functional_or_loud_enough"
        ) {
          this.PhoneClipSolution = [
            "Ensure the phone clipped is charged",
            "Increase the volume of the phone clip",
            "Ensure that the hearing aids are not in-flight mode",
          ];
          this.PhoneClipFinalOutcome = ["Found Ok", "Not Checked", "Resolved"];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedWirelessAccessories.pop();
    }
  }

  maxSelectionSynchronized() {
    // console.log('selection works');
    if (this.SelectedSynchronizedFunctionality.length <= 3) {
      this.functionalityEachEarSolution = [];
      this.functionalityEachEarFinalOutcome = [];

      this.SynchedPushBottomSolution = [];
      this.SynchedPushBottomFinalOutcome = [];

      for (let i = 0; i < this.SelectedSynchronizedFunctionality.length; i++) {
        if (
          this.SelectedSynchronizedFunctionality[i] ==
          "The_patient_would_like_to_separate_functionality_for_each_ear"
        ) {
          this.functionalityEachEarSolution = [
            "Turn off the synchronization function for volume control",
          ];
          this.functionalityEachEarFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedSynchronizedFunctionality[i] ==
          "Synched_push_bottom_volume_control_is_not_functioning"
        ) {
          this.SynchedPushBottomSolution = [
            "Ensure that the instruments are not in-flight mode",
          ];
          this.SynchedPushBottomFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedSynchronizedFunctionality.pop();
    }
  }

  maxSelectionPhysicalFit() {
    // console.log('max-selection works');

    if (this.SelectedPhysicalFit.length <= 3) {
      this.SlipsOutEarSolution = [];
      this.SlipsOutEarFinalOutcome = [];

      this.PainInEarSolution = [];
      this.PainInEarSolutionFinalOutcome = [];

      this.EarpieceInEarSolution = [];
      this.EarpieceInEarFinalOutcome = [];

      for (let i = 0; i < this.SelectedPhysicalFit.length; i++) {
        if (
          this.SelectedPhysicalFit[i] == "The_earpiece_slips_out_of_the_ear"
        ) {
          this.SlipsOutEarSolution = ["Instruct patient in placing earpiece"];
          this.SlipsOutEarFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedPhysicalFit[i] ==
          "The_ear_piece_causes_irritation_or_pain_in_the_ear"
        ) {
          this.PainInEarSolution = [
            "Instruct patient in placing earpiece",
            "Contact ENT",
          ];
          this.PainInEarSolutionFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedPhysicalFit[i] ==
          "Patient_has_difficulties_placing_the_hearing_aid_or_earpiece_in_the_ear"
        ) {
          this.EarpieceInEarSolution = [
            "Instruct patient in placing earpiece or hearing aid correctly",
          ];
          this.EarpieceInEarFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedPhysicalFit.pop();
    }
  }

  maxSelectionHearing() {
    // console.log("selection working", this.SelectedHearingAid);
    if (this.SelectedHearingAid.length <= 3) {
      this.UsingProgramButtonSolution = [];
      this.UsingProgramButtonFinalOutcome = [];

      this.PreferenceControlSolution = [];
      this.PreferenceControlFinalOutcome = [];

      this.HearingOnOffSolution = [];
      this.HearingOnOffFinalOutcome = [];

      this.ChangingBatteriesSolution = [];
      this.ChangingBatteriesFinalOutcome = [];

      this.ProtectionSystemSolution = [];
      this.ProtectionSystemFinalOutCome = [];

      for (let i = 0; i < this.SelectedHearingAid.length; i++) {
        if (
          this.SelectedHearingAid[i] ==
          "Patienthas_difficulties_using_the_program_button"
        ) {
          this.UsingProgramButtonSolution = [
            "Instruct client in hearing aid handling",
          ];
          this.UsingProgramButtonFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedHearingAid[i] ==
          "Patient_has_difficulties_using_the_preference_control"
        ) {
          this.PreferenceControlSolution = [
            "Instruct client in hearing aid handling",
          ];
          this.PreferenceControlFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedHearingAid[i] ==
          "Patient_has_difficulties_turning_the_hearing_aid_on_off"
        ) {
          this.HearingOnOffSolution = [
            "Instruct client in hearing aid handling",
          ];
          this.HearingOnOffFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedHearingAid[i] ==
          "Client_has_difficulties_changing_batteries"
        ) {
          this.ChangingBatteriesSolution = [
            "Instruct Patient in changing the batteries",
          ];
          this.ChangingBatteriesFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }

        if (
          this.SelectedHearingAid[i] ==
          "Client_has_difficulties_changing_wax_protection_system"
        ) {
          this.ProtectionSystemSolution = [
            "Instruct Patient in changing the wax guard",
          ];
          this.ProtectionSystemFinalOutCome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedHearingAid.pop();
    }
  }

  maxSelectionOthers() {
    if (this.SelectedOthers.length <= 3) {
      this.NoSoundSolution = [];
      this.NoSoundFinalOutcome = [];

      for (let i = 0; i < this.SelectedOthers.length; i++) {
        if (this.SelectedOthers[i] == "No_sound_from_the_hearing_aid") {
          this.NoSoundSolution = [
            "Inspect ear and remove cerumen if necessary",
            "Change the wax guard, if necessary",
            "Change the battery",
          ];
          this.NoSoundFinalOutcome = ["Found Ok", "Not Checked", "Resolved"];
        }
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "You Can choose maximum 3",
        detail: "maximum 3 ",
      });
      this.SelectedOthers.pop();
    }
  }

  getCenterList() {
    this.CentreList = [];
    const obj = {
      SP_String: "sp_JOH_Validation_Processt",
      Report_Name_String: "Get Cost Center",
    };
    this.GlobalApi.getData(obj).subscribe((data: any) => {
      // console.log('center list',data);
      if (data.length) {
        data.forEach((element) => {
          (element["label"] = element.Cost_Cen_Name),
            (element["value"] = element.Cost_Cen_ID);
        });
        this.CentreList = data;
      }
    });
  }

  getDataAgainstAppoId() {
    const tempobj = {
      Appo_ID: this.AppoID,
    };
    const obj = {
      SP_String: "SP_BL_Txn_Doctor_Appo_ABR",
      Report_Name_String: "Get_All_Data",
      Json_Param_String: JSON.stringify([tempobj]),
    };
    this.GlobalApi.getData(obj).subscribe((data: any) => {
      // console.log('data against appoid', data);
      if (data.length) {
        // this.AppoIDdata=data;
        this.ObjFineTuning.Name = data[0].Name;
        this.ObjFineTuning.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.ObjFineTuning.Age = data[0].Age;
        this.ObjFineTuning.Sex = data[0].Sex;
        this.ObjFineTuning.ReferredBy = data[0].Referredby;
        this.ObjFineTuning.Txn_Date = data[0].Appo_Dt;
        this.ObjFineTuning.Cost_Cent_ID = data[0].Cost_Cen_ID;
      }
    });
  }

  onConfirm() {

  }
  onReject() {
    this.compacctToast.clear();
  }
}
class FineTuning {
  Name: any;
  Age: any;
  Sex: any;
  ReferredBy: any;
  UserType: any;
  Ear: any;
  // 6 required field
  Foot_Fall_ID: any;
  Appo_ID: any;
  Txn_Date: any;
  Cost_Cent_ID: any;
  Posted_By: any;
  Posted_On: any;

  // 10 CheckBoxes
  selected_Loudness: any;
  Selected_Sound_Quality: any;
  Selected_Speech_Intelligibility: any;
  Selected_Feedback: any;
  Selected_Tinnitus: any;
  Selected_Wireless_Accessories: any;
  Selected_Synchronized_Functionality: any;
  Selected_PhysicalFit: any;
  Selected_HearingAid: any;
  Selected_Others: any;

  // Loudness
  Sounds_In_General_Solution: any;
  Sounds_In_General_FinalOutCome: any;
  Speech_Is_TooLoud_Solution: any;
  Speech_Is_TooLoud_FinalOutcome: any;
  HighFrequency_Sounds_Solution: any;
  HighFrequency_Sounds_FinalOutcome: any;
  LowFrequency_Sounds_Solution: any;
  LowFrequency_Sounds_FinalOutcome: any;
  SoundsOfMany_People_Solution: any;
  SoundsOfMany_People_FinalOutcome: any;
  LoudSoundsSeem_Distorted_Solution: any;
  LoudSoundsSeem_Distorted_FinalOutcome: any;
  SuddenNoisesAre_Painfully_Solution: any;
  SuddenNoisesAre_Painfully_FinalOutcome: any;
  AllSoundsAre_TooSoft_Solution: any;
  AllSoundsAre_TooSoft_FinalOutcome: any;
  SoftSounds_AreNot_Solution: any;
  SoftSounds_AreNot_FinalOutcome: any;
  SoftSpeechIsNot_Audible_Solution: any;
  SoftSpeechIsNot_Audible_FinalOutcome: any;
  SpeechIs_TooSoft_Solution: any;
  SpeechIs_TooSoft_FinalOutcome: any;
  HighFrequencySounds_AreTooSoft_Solution: any;
  HighFrequencySounds_AreTooSoft_FinalOutcome:any;
  VolumeControl_Needs_Solution: any;
  VolumeControl_Needs_FinalOutcome: any;
  WindNoise_Solution: any;
  WindNoise_FinalOutcome: any;
  Ambient_Noise_Solution: any;
  Ambient_Noise_FinalOutcome: any;

  // Sound Quality
  SpeechIs_Unclear_Solution: any;
  SpeechIs_Unclear_FinalOutcome: any;
  SpeechIs_Boomy_Solution: any;
  SpeechIs_Boomy_FinalOutcome: any;
  MaleVoices_Boomy_Solution: any;
  MaleVoices_Boomy_FinalOutcome: any;
  MaleVoices_Tinny_Solution: any;
  MaleVoices_Tinny_FinalOutcome: any;
  MaleVoices_Dull_Solution: any;
  MaleVoices_Dull_FinalOutcome: any;
  MaleVoices_Hollow_Solution: any;
  MaleVoices_Hollow_FinalOutcome: any;
  MaleVoices_Sharp_Solution: any;
  MaleVoices_Sharp_FinalOutcome: any;
  OwnVoices_Sharp_Solution: any;
  OwnVoices_Sharp_FinalOutcome: any;
  OwnVoices_Barrel_Solution: any;
  OwnVoices_Barrel_FinalOutcome: any;
  OwnVoices_Stuffing_Solution: any;
  OwnVoices_Stuffing_FinalOutcome: any;
  OwnVoicesNot_Accepct_Solution: any;
  OwnVoicesNot_Accepct_FinalOutcome: any;
  FemaleVoice_Tinny_Solution: any;
  FemaleVoice_Tinny_FinalOutcome: any;
  FemaleVoice_Dull_Solution: any;
  FemaleVoice_Dull_FinalOutcome: any;
  FemaleVoice_Hollow_Solution: any;
  FemaleVoice_Hollow_FinalOutcome: any;
  MusicSound_Boomy_Solution: any;
  MusicSound_Boomy_FinalOutcome: any;
  MusicSound_Tinny_Solution: any;
  MusicSound_Tinny_FinalOutcome: any;
  MusicSound_Dull_Solution: any;
  MusicSound_Dull_FinalOutcome: any;
  MusicSound_Hollow_Solution: any;
  MusicSound_Hollow_FinalOutcome: any;
  MusicSound_Sharp_Solution: any;
  MusicSound_Sharp_FinalOutcome: any;
  HighFrequencySoundsAre_Dull_Solution: any;
  HighFrequencySoundsAre_Dull_FinalOutcome: any;

  // speech is
  SpeechIs_Moderate_Solution: any;
  SpeechIs_Moderate_FinalOutcome: any;
  Understanding_Speech_Solution: any;
  Understanding_Speech_FinalOutcome: any;
  Distance_Voice_Solution: any;
  Distance_Voice_FinalOutcome;
  any;
  Understandings_Speaker_Solution: any;
  Understandings_Speaker_FinalOutcome: any;
  HearDistance_Speech_Solution: any;
  HearDistance_Speech_FinalOutcome: any;
  Sound_Localization_Solution: any;
  Sound_Localization_FinalOutcome: any;
  PoorSpeech_Perception_Solution: any;
  PoorSpeech_Perception_FinalOutcome: any;
  SoundTurned_Down_Solution: any;
  SoundTurned_Down_FinalOutcome: any;
  Sound_Distorted_Solution: any;
  Sound_Distorted_FinalOutcome: any;

  // feedback
  Hearing_Occasionally_Solution: any;
  Hearing_Occasionally_FinalOutcome: any;
  Feedback_Occurs_Solution: any;
  Feedback_Occurs_FinalOutcome: any;
  Hearing_Whistles_Solution: any;
  Hearing_Whistles_FinalOutcome: any;
  // tinnitus

  ZENTone_Synchronization_Solution: any;
  ZENTone_Synchronization_FinalOutcome: any;
  ZENToneSynchronizationK_Loud_Solution: any;
  ZENToneSynchronizationK_Loud_FinalOutcome: any;
  Broadband_Stimulation_Solution: any;
  Broadband_Stimulation_FinalOutcome: any;
  ZENToneWhite_Noise_Solution: any;
  ZENToneWhite_Noise_FinalOutcome: any;
  ZENToneContinuous_Stimulation_Solution: any;
  ZENToneContinuous_Stimulation_FinalOutcome: any;
  Amplitude_Modulation_Solution: any;
  Amplitude_Modulation_FinalOutcome: any;
  Stimuli_Besides_Solution: any;
  Stimuli_Besides_FinalOutcome: any;
  TinnitusSeems_Worse_Solution: any;
  TinnitusSeems_Worse_FinalOutcome: any;
  Patient_Requesting_Solution: any;
  Patient_Requesting_FinalOutcome: any;
  TSGWhite_Noise_Solution: any;
  TSGWhite_Noise_FinalOutcome: any;

  // Wireless Accessories

  MicroMiniMulti_Noise_Solution: any;
  MicroMiniMulti_Noise_FinalOutcome: any;
  PhoneClip_Solution: any;
  PhoneClip_FinalOutcome: any;

  // Synchronized Functionality

  functionality_EachEar_Solution: any;
  functionality_EachEar_FinalOutcome: any;
  SynchedPush_Bottom_Solution: any;
  SynchedPush_Bottom_FinalOutcome: any;

  // physical fit

  Slips_OutEar_Solution: any;
  Slips_OutEar_FinalOutcome: any;
  PainInEar_Solution: any;
  PainInEar_FinalOutcome: any;
  EarpieceIn_Ear_Solution: any;
  EarpieceIn_Ear_FinalOutcome: any;

  // hearing Aid

  UsingProgram_Button_Solution: any;
  UsingProgram_Button_FinalOutcome: any;
  Preference_Control_Solution: any;
  Preference_Control_FinalOutcome: any;
  Hearing_OnOff_Solution: any;
  Hearing_OnOff_FinalOutcome: any;
  Changing_Batteries_Solution: any;
  Changing_Batteries_FinalOutcome: any;
  Protection_System_Solution: any;
  Protection_System_FinalOutcome: any;
  // others

  NoSound_Solution: any;
  NoSound_FinalOutcome: any;
  // comment
  comment: any;
  // prints:any;
}
