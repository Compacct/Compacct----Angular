import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { UpdateConsultancyComponent } from "../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";


@Component({
  selector: 'app-doctors-appointment-new-fine-tuning-hearing',
  templateUrl: './doctors-appointment-new-fine-tuning-hearing.component.html',
  styleUrls: ['./doctors-appointment-new-fine-tuning-hearing.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewFineTuningHearingComponent implements OnInit {
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

  //Print 10 array
  printLoudness:any = []
  printSound:any = []
  printSpeech:any = [] 
  printFeedback:any = [] 
  printTinnitus:any = []
  printWireless: any= []
  printSynchronized: any = []
  printPhysical: any = []
  printHearing: any = []
  printOthers: any= []

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

  updateConsultancysave(event) {
    this.Level_1_Status = event.Level_1_Status;
    this.Level_2_Status = event.Level_2_Status;
    this.Level_3_Status = event.Level_3_Status;
  }

  saveDocAppo(valid: any) {
    this.undefined1();
    this.undefined2();
    this.undefined3();
    this.undefined4();
    this.undefined5();
    this.undefined6();
    this.undefined7();
    this.undefined8();
    this.undefined9();
    this.undefined10();

    this.ObjFineTuning.Prints = []
    this.ObjFineTuning.Appo_ID = this.AppoID;
    this.ObjFineTuning.Posted_By = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjFineTuning.Posted_On = this.DateService.dateConvert(new Date());
    // 10 CheckBoxes
    this.ObjFineTuning.selected_Loudness = this.selectedLoudness;
    this.ObjFineTuning.Selected_Sound_Quality = this.SelectedSoundQuality;
    this.ObjFineTuning.Selected_Speech_Intelligibility = this.SelectedSpeechIntelligibility;
    this.ObjFineTuning.Selected_Feedback = this.SelectedFeedback;
    this.ObjFineTuning.Selected_Tinnitus = this.SelectedTinnitus;
    this.ObjFineTuning.Selected_Wireless_Accessories =  this.SelectedWirelessAccessories;
    this.ObjFineTuning.Selected_Synchronized_Functionality =  this.SelectedSynchronizedFunctionality;
    this.ObjFineTuning.Selected_PhysicalFit = this.SelectedPhysicalFit;
    this.ObjFineTuning.Selected_HearingAid = this.SelectedHearingAid;
    this.ObjFineTuning.Selected_Others = this.SelectedOthers;



        // Part1
        if(this.selectedLoudness.length && this.printLoudness.length){

          if( this.printLoudness.length == 2){
            this.printLoudness.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          if( this.printLoudness.length == 1){
            this.printLoudness.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })

             this.printLoudness.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
            Section: "Loudness",
            S1_Problem: this.printLoudness[0].Topic,
            S2_Problem: this.printLoudness[1].Topic,
            S3_Problem: this.printLoudness[2].Topic,
            S1_Solution: this.printLoudness[0].S1,
            S2_Solution: this.printLoudness[1].S1,
            S3_Solution: this.printLoudness[2].S1,
            S1_Outcome: this.printLoudness[0].S1_Outcome,
            S2_Outcome: this.printLoudness[1].S1_Outcome,
            S3_Outcome: this.printLoudness[2].S1_Outcome
          }
          this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.selectedLoudness.length && !this.printLoudness.length){
          const printObj={
            Section: "Loudness",
            S1_Problem: "",
            S2_Problem: "",
            S3_Problem: "",
            S1_Solution: "",
            S2_Solution: "",
            S3_Solution: "",
            S1_Outcome: "",
            S2_Outcome: "",
            S3_Outcome: ""
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part2
        if(this.SelectedSoundQuality.length && this.printSound.length){

          if( this.printSound.length == 2){
            this.printSound.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          if( this.printSound.length == 1){
            this.printSound.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })

             this.printSound.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Sound Quality",
              S1_Problem: this.printSound[0].Topic,
              S2_Problem: this.printSound[1].Topic,
              S3_Problem: this.printSound[2].Topic,
              S1_Solution: this.printSound[0].S1,
              S2_Solution: this.printSound[1].S1,
              S3_Solution: this.printSound[2].S1,
              S1_Outcome: this.printSound[0].S1_Outcome,
              S2_Outcome: this.printSound[1].S1_Outcome,
              S3_Outcome: this.printSound[2].S1_Outcome
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedSoundQuality.length && !this.printSound.length){
          const printObj={
            Section: "Sound Quality",
            S1_Problem: "",
            S2_Problem: "",
            S3_Problem: "",
            S1_Solution: "",
            S2_Solution: "",
            S3_Solution: "",
            S1_Outcome: "",
            S2_Outcome: "",
            S3_Outcome: ""
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part3
        if(this.SelectedSpeechIntelligibility.length && this.printSpeech.length){

          if( this.printSpeech.length == 2){
            this.printSpeech.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          if( this.printSpeech.length == 1){
            this.printSpeech.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })

             this.printSpeech.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Speech Intelligibility",
              S1_Problem: this.printSpeech[0].Topic,
              S2_Problem: this.printSpeech[1].Topic,
              S3_Problem: this.printSpeech[2].Topic,
              S1_Solution: this.printSpeech[0].S1,
              S2_Solution: this.printSpeech[1].S1,
              S3_Solution: this.printSpeech[2].S1,
              S1_Outcome: this.printSpeech[0].S1_Outcome,
              S2_Outcome: this.printSpeech[1].S1_Outcome,
              S3_Outcome: this.printSpeech[2].S1_Outcome              
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedSpeechIntelligibility.length && !this.printSpeech.length){
          const printObj={
            Section: "Speech Intelligibility",
            S1_Problem: "",
            S2_Problem: "",
            S3_Problem: "",
            S1_Solution: "",
            S2_Solution: "",
            S3_Solution: "",
            S1_Outcome: "",
            S2_Outcome: "",
            S3_Outcome: ""
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part4
        if(this.SelectedFeedback.length && this.printFeedback.length){

          if( this.printFeedback.length == 2){
            this.printFeedback.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          if( this.printFeedback.length == 1){
            this.printFeedback.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })

             this.printFeedback.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Feedback",
              S1_Problem: this.printFeedback[0].Topic,
              S2_Problem: this.printFeedback[1].Topic,
              S3_Problem: this.printFeedback[2].Topic,
              S1_Solution: this.printFeedback[0].S1,
              S2_Solution: this.printFeedback[1].S1,
              S3_Solution: this.printFeedback[2].S1,
              S1_Outcome: this.printFeedback[0].S1_Outcome,
              S2_Outcome: this.printFeedback[1].S1_Outcome,
              S3_Outcome: this.printFeedback[2].S1_Outcome  
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedFeedback.length && !this.printFeedback.length){
          const printObj={
            Section: "Feedback",
            S1_Problem: "",
            S2_Problem: "",
            S3_Problem: "",
            S1_Solution: "",
            S2_Solution: "",
            S3_Solution: "",
            S1_Outcome: "",
            S2_Outcome: "",
            S3_Outcome: ""
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part5
        if(this.SelectedTinnitus.length && this.printTinnitus.length){

          if( this.printTinnitus.length == 2){
            this.printTinnitus.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          if( this.printTinnitus.length == 1){
            this.printTinnitus.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })

             this.printTinnitus.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Tinnitus",
              S1_Problem: this.printTinnitus[0].Topic,
              S2_Problem: this.printTinnitus[1].Topic,
              S3_Problem: this.printTinnitus[2].Topic,
              S1_Solution: this.printTinnitus[0].S1,
              S2_Solution: this.printTinnitus[1].S1,
              S3_Solution: this.printTinnitus[2].S1,
              S1_Outcome: this.printTinnitus[0].S1_Outcome,
              S2_Outcome: this.printTinnitus[1].S1_Outcome,
              S3_Outcome: this.printTinnitus[2].S1_Outcome
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedTinnitus.length && !this.printTinnitus.length){
          const printObj={
            Section: "Tinnitus",
            S1_Problem: "",
            S2_Problem: "",
            S3_Problem: "",
            S1_Solution: "",
            S2_Solution: "",
            S3_Solution: "",
            S1_Outcome: "",
            S2_Outcome: "",
            S3_Outcome: ""
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part6
        if(this.SelectedWirelessAccessories.length && this.printWireless.length){

          if( this.printWireless.length == 1){
            this.printWireless.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Wireless Accessories",
              S1_Problem: this.printWireless[0].Topic,
              S2_Problem: this.printWireless[1].Topic,
           
              S1_Solution: this.printWireless[0].S1,
              S2_Solution: this.printWireless[1].S1,
            
              S1_Outcome: this.printWireless[0].S1_Outcome,
              S2_Outcome: this.printWireless[1].S1_Outcome
              
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedWirelessAccessories.length && !this.printWireless.length){
          const printObj={
            Section: "Wireless Accessories",
            S1_Problem: "",
            S2_Problem: "",
           
            S1_Solution: "",
            S2_Solution: "",
           
            S1_Outcome: "",
            S2_Outcome: ""
            
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part7
        if(this.SelectedSynchronizedFunctionality.length && this.printSynchronized.length){

          if( this.printSynchronized.length == 1){
            this.printSynchronized.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Synchronized Functionality",
              S1_Problem: this.printSynchronized[0].Topic,
              S2_Problem: this.printSynchronized[1].Topic,
           
              S1_Solution: this.printSynchronized[0].S1,
              S2_Solution: this.printSynchronized[1].S1,
            
              S1_Outcome: this.printSynchronized[0].S1_Outcome,
              S2_Outcome: this.printSynchronized[1].S1_Outcome
              
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedSynchronizedFunctionality.length && !this.printSynchronized.length){
          const printObj={
            Section: "Synchronized Functionality",
            S1_Problem: "",
            S2_Problem: "",
            
            S1_Solution: "",
            S2_Solution: "",
        
            S1_Outcome: "",
            S2_Outcome: ""
           
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part8
        if(this.SelectedPhysicalFit.length && this.printPhysical.length){

          if( this.printPhysical.length == 2){
            this.printPhysical.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          if( this.printPhysical.length == 1){
            this.printPhysical.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })

             this.printPhysical.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Physical Fit",
              S1_Problem: this.printPhysical[0].Topic,
              S2_Problem: this.printPhysical[1].Topic,
              S3_Problem: this.printPhysical[2].Topic,
              S1_Solution: this.printPhysical[0].S1,
              S2_Solution: this.printPhysical[1].S1,
              S3_Solution: this.printPhysical[2].S1,
              S1_Outcome: this.printPhysical[0].S1_Outcome,
              S2_Outcome: this.printPhysical[1].S1_Outcome,
              S3_Outcome: this.printPhysical[2].S1_Outcome
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedPhysicalFit.length && !this.printPhysical.length){
          const printObj={
            Section: "Physical Fit",
            S1_Problem: "",
            S2_Problem: "",
            S3_Problem: "",
            S1_Solution: "",
            S2_Solution: "",
            S3_Solution: "",
            S1_Outcome: "",
            S2_Outcome: "",
            S3_Outcome: ""
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part9
        if(this.SelectedHearingAid.length && this.printHearing.length){

          if( this.printHearing.length == 2){
            this.printHearing.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          if( this.printHearing.length == 1){
            this.printHearing.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })

             this.printHearing.push({
              Topic: "",
              S1: "",
              S1_Outcome: "",
             })
          }

          const printObj={
              Section: "Hearing Aid Handling & Maintance",
              S1_Problem: this.printHearing[0].Topic,
              S2_Problem: this.printHearing[1].Topic,
              S3_Problem: this.printHearing[2].Topic,
              S1_Solution: this.printHearing[0].S1,
              S2_Solution: this.printHearing[1].S1,
              S3_Solution: this.printHearing[2].S1,
              S1_Outcome: this.printHearing[0].S1_Outcome,
              S2_Outcome: this.printHearing[1].S1_Outcome,
              S3_Outcome: this.printHearing[2].S1_Outcome
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedHearingAid.length && !this.printHearing.length){
          const printObj={
            Section: "Hearing Aid Handling & Maintance",
            S1_Problem: "",
            S2_Problem: "",
            S3_Problem: "",
            S1_Solution: "",
            S2_Solution: "",
            S3_Solution: "",
            S1_Outcome: "",
            S2_Outcome: "",
            S3_Outcome: ""
          }
          this.ObjFineTuning.Prints.push(printObj)
        }

        // Part10
        if(this.SelectedOthers.length && this.printOthers.length){

          const printObj={
              Section: "Others",
              S1_Problem: this.printOthers[0].Topic,

           
              S1_Solution: this.printOthers[0].S1,
              
            
              S1_Outcome: this.printOthers[0].S1_Outcome
              
              
          }
            this.ObjFineTuning.Prints.push(printObj)
        }



        if(!this.SelectedOthers.length && !this.printOthers.length){
          const printObj={
            Section: "Others",
            S1_Problem: "",
           

            S1_Solution: "",
            

            S1_Outcome: "",
           

          }
          this.ObjFineTuning.Prints.push(printObj)
        }


        
        // console.log("printLoudness",this.printLoudness)
        // console.log("printSound",this.printSound)
        // console.log("printSpeech",this.printSpeech)
        // console.log("printFeedback",this.printFeedback)
        // console.log("printTinnitus",this.printTinnitus)
        // console.log("printWireless",this.printWireless)
        // console.log("printSynchronized",this.printSynchronized)
        // console.log("printPhysical",this.printPhysical)
        // console.log("printHearing",this.printHearing)
        // console.log("printOthers",this.printOthers)

               
  //  console.log("ObjFineTuning",this.ObjFineTuning)

   const TempObj = this.ObjFineTuning;

    const tempSaveJ2 = {
      Appo_ID: this.AppoID,
    };
    const tempSaveJ3 = {
      Test_Name: this.TestName,
    };
    if (valid) {
      // console.log('1st save',this.ObjFineTuning);
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
      // console.log(data);
      this.EditDetails = JSON.parse(data[0].Test_Details);

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

      
      this.maxSelectionLoudness(this.EditDetails.Prints[0].S1_Problem,this.EditDetails.Prints[0].S1_Solution,this.EditDetails.Prints[0].S1_Outcome);
      this.maxSelectionLoudness(this.EditDetails.Prints[0].S2_Problem,this.EditDetails.Prints[0].S2_Solution,this.EditDetails.Prints[0].S2_Outcome);
      this.maxSelectionLoudness(this.EditDetails.Prints[0].S3_Problem,this.EditDetails.Prints[0].S3_Solution,this.EditDetails.Prints[0].S3_Outcome);

      this.maxSelectionSound(this.EditDetails.Prints[1].S1_Problem,this.EditDetails.Prints[1].S1_Solution,this.EditDetails.Prints[1].S1_Outcome);
      this.maxSelectionSound(this.EditDetails.Prints[1].S2_Problem,this.EditDetails.Prints[1].S2_Solution,this.EditDetails.Prints[1].S2_Outcome);
      this.maxSelectionSound(this.EditDetails.Prints[1].S3_Problem,this.EditDetails.Prints[1].S3_Solution,this.EditDetails.Prints[1].S3_Outcome);

      this.maxSelectionSpeech(this.EditDetails.Prints[2].S1_Problem,this.EditDetails.Prints[2].S1_Solution,this.EditDetails.Prints[2].S1_Outcome);
      this.maxSelectionSpeech(this.EditDetails.Prints[2].S2_Problem,this.EditDetails.Prints[2].S2_Solution,this.EditDetails.Prints[2].S2_Outcome);
      this.maxSelectionSpeech(this.EditDetails.Prints[2].S3_Problem,this.EditDetails.Prints[2].S3_Solution,this.EditDetails.Prints[2].S3_Outcome);

      this.maxSelectionFeedback(this.EditDetails.Prints[3].S1_Problem,this.EditDetails.Prints[3].S1_Solution,this.EditDetails.Prints[3].S1_Outcome);
      this.maxSelectionFeedback(this.EditDetails.Prints[3].S2_Problem,this.EditDetails.Prints[3].S2_Solution,this.EditDetails.Prints[3].S2_Outcome);
      this.maxSelectionFeedback(this.EditDetails.Prints[3].S3_Problem,this.EditDetails.Prints[3].S3_Solution,this.EditDetails.Prints[3].S3_Outcome);
      
      this.maxSelectionTinnitus(this.EditDetails.Prints[4].S1_Problem,this.EditDetails.Prints[4].S1_Solution,this.EditDetails.Prints[4].S1_Outcome);
      this.maxSelectionTinnitus(this.EditDetails.Prints[4].S2_Problem,this.EditDetails.Prints[4].S2_Solution,this.EditDetails.Prints[4].S2_Outcome);
      this.maxSelectionTinnitus(this.EditDetails.Prints[4].S3_Problem,this.EditDetails.Prints[4].S3_Solution,this.EditDetails.Prints[4].S3_Outcome);
      
      this.maxSelectionWireless(this.EditDetails.Prints[5].S1_Problem,this.EditDetails.Prints[5].S1_Solution,this.EditDetails.Prints[5].S1_Outcome);
      this.maxSelectionWireless(this.EditDetails.Prints[5].S2_Problem,this.EditDetails.Prints[5].S2_Solution,this.EditDetails.Prints[5].S2_Outcome);

      this.maxSelectionSynchronized(this.EditDetails.Prints[6].S1_Problem,this.EditDetails.Prints[6].S1_Solution,this.EditDetails.Prints[6].S1_Outcome);
      this.maxSelectionSynchronized(this.EditDetails.Prints[6].S2_Problem,this.EditDetails.Prints[6].S2_Solution,this.EditDetails.Prints[6].S2_Outcome);

      this.maxSelectionPhysicalFit(this.EditDetails.Prints[7].S1_Problem,this.EditDetails.Prints[7].S1_Solution,this.EditDetails.Prints[7].S1_Outcome);
      this.maxSelectionPhysicalFit(this.EditDetails.Prints[7].S2_Problem,this.EditDetails.Prints[7].S2_Solution,this.EditDetails.Prints[7].S2_Outcome);
      this.maxSelectionPhysicalFit(this.EditDetails.Prints[7].S3_Problem,this.EditDetails.Prints[7].S3_Solution,this.EditDetails.Prints[7].S3_Outcome);

      this.maxSelectionHearing(this.EditDetails.Prints[8].S1_Problem,this.EditDetails.Prints[8].S1_Solution,this.EditDetails.Prints[8].S1_Outcome);
      this.maxSelectionHearing(this.EditDetails.Prints[8].S2_Problem,this.EditDetails.Prints[8].S2_Solution,this.EditDetails.Prints[8].S2_Outcome);
      this.maxSelectionHearing(this.EditDetails.Prints[8].S3_Problem,this.EditDetails.Prints[8].S3_Solution,this.EditDetails.Prints[8].S3_Outcome);

      this.maxSelectionOthers(this.EditDetails.Prints[9].S1_Problem,this.EditDetails.Prints[9].S1_Solution,this.EditDetails.Prints[9].S1_Outcome);


      
    // for dropdowns
      this.editData2();
      
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





// checkbox change function


  maxSelectionLoudness(value?:any,s1?:any,S1_Outcome?:any) {
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
        if (this.selectedLoudness[i] == "Sounds in general are too loud") {
          this.SoundsInGeneralSolution = ["Decrease overall gain"];
          this.SoundsInGeneralFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
       
       if (
          this.selectedLoudness[i] == "Speech is too loud (speaker is too loud)"
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
       
        if (
          this.selectedLoudness[i] ==
          "High frequency sounds are too loud (dishes, rattling, paper rustling, water running)"
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
       
        if (
          this.selectedLoudness[i] ==
          "Low frequency sounds are too loud (toilet flushing, road noise, fans, etc.)"
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
       
        if (
          this.selectedLoudness[i] ==
          "The sounds of many people talking are too loud"
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
       
        if (this.selectedLoudness[i] == "Loud sounds seem distorted") {
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
       
        if (this.selectedLoudness[i] == "Sudden noises are painfully loud") {
          this.SuddenNoisesArePainfullySolution = [
            "Reduce the maximum output level in the high frequencies",
          ];
          this.SuddenNoisesArePainfullyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
       
        if (this.selectedLoudness[i] == "All sounds are too soft") {
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
          "Soft sounds are not audible in quite surroundings"
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
       
        if (this.selectedLoudness[i] == "Soft speech is not audible") {
          this.SoftSpeechIsNotAudibleSolution = [
            "Increase gain for soft input level",
          ];
          this.SoftSpeechIsNotAudibleFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
      
        if (this.selectedLoudness[i] == "Speech is Too Soft") {
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
      
        if (
          this.selectedLoudness[i] ==
          "High frequency sounds are too soft (birdsong, doorbell, telephone ring)"
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
        
        if (
          this.selectedLoudness[i] == "Volume control needs frequent adjustment"
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
       
        if (this.selectedLoudness[i] == "Wind noise is too loud") {
          this.WindNoiseSolution = [
            "Increase wind guard setting",
            "Turn Wind Guard feature on",
          ];
          this.WindNoiseFinalOutcome = ["Found Ok", "Not Checked", "Resolved"];
        }
        if (
          this.selectedLoudness[i] ==
          "Ambient noise is too noticeable in quite surroundings"
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
      if(value){
        this.changeSpeechIsTooLoudSolution(value,s1,S1_Outcome)
      }
      
    } 
    
    else {
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

  maxSelectionSound(value?:any,s1?:any,S1_Outcome?:any) {
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
        if (this.SelectedSoundQuality[i] == "Speech is unclear/muffled") {
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
        if (this.SelectedSoundQuality[i] == "Speech is boomy or has an echo") {
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
        if (this.SelectedSoundQuality[i] == "Male voices sound boomy") {
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
          this.SelectedSoundQuality[i] == "Male voices sound tinny or metallic"
        ) {
          this.MaleVoicesTinnySolution = ["Decrease gain for high frequencies"];
          this.MaleVoicesTinnyFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Male voices sound dull") {
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
        if (this.SelectedSoundQuality[i] == "Male voices sound hollow") {
          this.MaleVoicesHollowSolution = ["Decrease low frequency gain"];
          this.MaleVoicesHollowFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Male voices sound sharp") {
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
        if (this.SelectedSoundQuality[i] == "Own voices sound sharp") {
          this.OwnVoicesSharpSolution = ["Decrease high frequency gain"];
          this.OwnVoicesSharpFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (
          this.SelectedSoundQuality[i] ==
          "Own voice sounds as if speaking “in a barrel” or has an “echo”"
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
          "Own voice sounds “stuffed up” or “closed”"
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
        if (this.SelectedSoundQuality[i] == "Own voice is not acceptable") {
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
          "Female voices sound tinny or metallic"
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
        if (this.SelectedSoundQuality[i] == "Female voices sound dull") {
          this.FemaleVoiceDullSolution = [
            "Increase overall gain for mid and high frequencies",
          ];
          this.FemaleVoiceDullFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Female voices sound hollow") {
          this.FemaleVoiceHollowSolution = ["Decrease low frequency gain"];
          this.FemaleVoiceHollowFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "Music sound boomy") {
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
        if (this.SelectedSoundQuality[i] == "Music sound tinny or metallic") {
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
        if (this.SelectedSoundQuality[i] == "Music sound dull") {
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
        if (this.SelectedSoundQuality[i] == "Music sound hollow") {
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
        if (this.SelectedSoundQuality[i] == "Music sound sharp") {
          this.MusicSoundSharpSolution = [
            "Increase low frequency gain and decrease mid and high frequency gain",
          ];
          this.MusicSoundSharpFinalOutcome = [
            "Found Ok",
            "Not Checked",
            "Resolved",
          ];
        }
        if (this.SelectedSoundQuality[i] == "High frequency sounds are dull") {
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

      if(value){
        this.changeSelectionSound(value,s1,S1_Outcome);
      }
    } 
    
    else {
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

  maxSelectionSpeech(value?:any,s1?:any,S1_Outcome?:any) {
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
          "Speech is unclear in moderate background noise"
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
          "Understanding speech when in a car, train, airplane, etc. is difficult"
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
          "Distance voices/sounds seem louder than voices/sounds nearby"
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
          "Understanding a speaker who is far away is difficult"
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
          "Hear distance speech better than close speech"
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
          "Sound localization is difficult"
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
          "Sound is turned down too much in noisy environments"
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
          "Sound is distorted or very uncomfortable in noisy environments"
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

      if(value){
        this.changeSelectionSpeech(value,s1,S1_Outcome);
      }

    } 
    
    else {
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

  maxSelectionFeedback(value?:any,s1?:any,S1_Outcome?:any) {
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
          "Hearing aid whistles occasionally, e.g. when hugging a person, putting on a hat or while chewing"
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
          "Feedback occurs with the use of the telephone and/or other dynamic situations"
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
        if (this.SelectedFeedback[i] == "Hearing aid whistles unprovoked") {
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

      if(value){
        this.changeSelectionFeedback(value,s1,S1_Outcome);
      }
    } 
    
    else {
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

  maxSelectionTinnitus(value?:any,s1?:any,S1_Outcome?:any) {
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
          "ZEN tone/TSG synchronization white noise is too soft"
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
          "ZEN tone/TSG synchronization white noise is too loud"
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
          this.SelectedTinnitus[i] == "Broadband stimulation is not effective"
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
          "ZEN tone/White noise is not effectively interacting with the tinnitus"
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
          "ZEN tone/Continuous stimulation is bothersome"
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
        if (this.SelectedTinnitus[i] == "Amplitude modulation is bothersome") {
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
          "Other stimuli besides ZEN tone/white noise are helpful"
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

        if (this.SelectedTinnitus[i] == "Tinnitus seems worse") {
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
          "The patient is requesting an automatic volume control adjustment for TSG"
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
          "ZEN tone/TSG white noise interferes with speech"
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

      if(value){
        this.changeSelectionTinnitus(value,s1,S1_Outcome);
      }
    } 
    
    else {
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

  maxSelectionWireless(value?:any,s1?:any,S1_Outcome?:any) {
    // console.log('selection works');
    if (this.SelectedWirelessAccessories.length <= 3) {
      this.MicroMiniMultiNoiseSolution = [];
      this.MicroMiniMultiNoiseFinalOutcome = [];

      this.PhoneClipSolution = [];
      this.PhoneClipFinalOutcome = [];

      for (let i = 0; i < this.SelectedWirelessAccessories.length; i++) {
        if (
          this.SelectedWirelessAccessories[i] ==
          "Micro/Mini/Multi mic is too noisy"
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
          "Phone clip is not functional or loud enough"
        ) {
          this.PhoneClipSolution = [
            "Ensure the phone clipped is charged",
            "Increase the volume of the phone clip",
            "Ensure that the hearing aids are not in-flight mode",
          ];
          this.PhoneClipFinalOutcome = ["Found Ok", "Not Checked", "Resolved"];
        }
      }

      if(value){
        this.changeSelectionWireless(value,s1,S1_Outcome);
      }
    } 
    
    else {
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

  maxSelectionSynchronized(value?:any,s1?:any,S1_Outcome?:any) {
    // console.log('selection works');
    if (this.SelectedSynchronizedFunctionality.length <= 3) {
      this.functionalityEachEarSolution = [];
      this.functionalityEachEarFinalOutcome = [];

      this.SynchedPushBottomSolution = [];
      this.SynchedPushBottomFinalOutcome = [];

      for (let i = 0; i < this.SelectedSynchronizedFunctionality.length; i++) {
        if (
          this.SelectedSynchronizedFunctionality[i] ==
          "The patient would like to separate functionality for each ear"
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
          "Synched push bottom/volume control is not functioning"
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

      if(value){
        this.changeSelectionSynchronized(value,s1,S1_Outcome);
      }
    } 
    
    else {
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

  maxSelectionPhysicalFit(value?:any,s1?:any,S1_Outcome?:any) {
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
          this.SelectedPhysicalFit[i] == "The earpiece slips out of the ear"
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
          "The ear piece causes irritation or pain in the ear"
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
          "Patient has difficulties placing the hearing aid or earpiece in the ear"
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

      if(value){
        this.changeSelectionPhysical(value,s1,S1_Outcome);
      }
    } 
    
    else {
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

  maxSelectionHearing(value?:any,s1?:any,S1_Outcome?:any) {
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
          "Patient has difficulties using the program button"
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
          "Patient has difficulties using the preference control"
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
          "Patient has difficulties turning the hearing aid on and off"
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
          "Client has difficulties changing batteries"
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
          "Client has difficulties changing wax protection system"
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

      if(value){
        this.changeSelectionHearing(value,s1,S1_Outcome);
      }
    } 
    
    else {
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

  maxSelectionOthers(value?:any,s1?:any,S1_Outcome?:any) {
    if (this.SelectedOthers.length <= 3) {
      this.NoSoundSolution = [];
      this.NoSoundFinalOutcome = [];

      for (let i = 0; i < this.SelectedOthers.length; i++) {
        if (this.SelectedOthers[i] == "No sound from the hearing aid") {
          this.NoSoundSolution = [
            "Inspect ear and remove cerumen if necessary",
            "Change the wax guard, if necessary",
            "Change the battery",
          ];
          this.NoSoundFinalOutcome = ["Found Ok", "Not Checked", "Resolved"];
        }
      }

      if(value){
        this.changeSelectionOthers(value,s1,S1_Outcome);
      }
    } 
    
    else {
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






 // dropdown change function

  changeSpeechIsTooLoudSolution(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.selectedLoudness.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printLoudness.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printLoudness.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printLoudness.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printLoudness.length; i++) {
      if(this.printLoudness[i].Topic == ChkBoxValue){
        this.printLoudness.splice(i,1);
      }
      
    }
  }
  // console.log(this.printLoudness)
  }

  changeSelectionSound(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedSoundQuality.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printSound.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printSound.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printSound.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printSound.length; i++) {
      if(this.printSound[i].Topic == ChkBoxValue){
        this.printSound.splice(i,1);
      }
      
    }
  }
  // console.log(this.printSound)
  }

  changeSelectionSpeech(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedSpeechIntelligibility.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printSpeech.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printSpeech.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printSpeech.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printSpeech.length; i++) {
      if(this.printSpeech[i].Topic == ChkBoxValue){
        this.printSpeech.splice(i,1);
      }
      
    }
  }
  // console.log(this.printSpeech)
  }

  changeSelectionFeedback(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedFeedback.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printFeedback.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printFeedback.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printFeedback.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printFeedback.length; i++) {
      if(this.printFeedback[i].Topic == ChkBoxValue){
        this.printFeedback.splice(i,1);
      }
      
    }
  }
  // console.log(this.printFeedback)
  }
  
  changeSelectionTinnitus(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedTinnitus.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printTinnitus.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printTinnitus.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printTinnitus.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printTinnitus.length; i++) {
      if(this.printTinnitus[i].Topic == ChkBoxValue){
        this.printTinnitus.splice(i,1);
      }
      
    }
  }
  // console.log(this.printTinnitus)
  }
  
  changeSelectionWireless(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedWirelessAccessories.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printWireless.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printWireless.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printWireless.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printWireless.length; i++) {
      if(this.printWireless[i].Topic == ChkBoxValue){
        this.printWireless.splice(i,1);
      }
      
    }
  }
  // console.log(this.printWireless)
  }
 
  changeSelectionSynchronized(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedSynchronizedFunctionality.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printSynchronized.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printSynchronized.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printSynchronized.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printSynchronized.length; i++) {
      if(this.printSynchronized[i].Topic == ChkBoxValue){
        this.printSynchronized.splice(i,1);
      }
      
    }
  }
  // console.log(this.printSynchronized)
  }
  
  changeSelectionPhysical(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedPhysicalFit.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printPhysical.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printPhysical.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printPhysical.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printPhysical.length; i++) {
      if(this.printPhysical[i].Topic == ChkBoxValue){
        this.printPhysical.splice(i,1);
      }
      
    }
  }
  // console.log(this.printPhysical)
  }
  
  changeSelectionHearing(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedHearingAid.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printHearing.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printHearing.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printHearing.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printHearing.length; i++) {
      if(this.printHearing[i].Topic == ChkBoxValue){
        this.printHearing.splice(i,1);
      }
      
    }
  }
  // console.log(this.printHearing)
  }
  
  changeSelectionOthers(ChkBoxValue:any,S1:any,S1_Outcome:any){
    // console.log("ChkBoxValue",ChkBoxValue)
  const Findselected = this.SelectedOthers.filter((el:any)=> el == ChkBoxValue)
  if(Findselected.length){
    const Filterprint = this.printOthers.filter((el:any)=> el.Topic == ChkBoxValue)
    if(Filterprint.length){
      this.printOthers.forEach((element,inx) => {
        if(element.Topic == ChkBoxValue){
          element.S1 = S1
          element.S1_Outcome = S1_Outcome
        }
      });
   }
    else {
     this.printOthers.push({
        Topic: ChkBoxValue,
        S1: S1? S1 : "",
        S1_Outcome: S1_Outcome ? S1_Outcome : "",
       })
    }
    
     
  }
  else {
    for (let i = 0; i < this.printOthers.length; i++) {
      if(this.printOthers[i].Topic == ChkBoxValue){
        this.printOthers.splice(i,1);
      }
      
    }
  }
  // console.log(this.printOthers)
  }





  // undefined

  undefined1(){

    if((this.selectedLoudness[0] !=  "Sounds in general are too loud") && 
       (this.selectedLoudness[1] !=  "Sounds in general are too loud") && 
       (this.selectedLoudness[2] !=  "Sounds in general are too loud")){
    this.ObjFineTuning.Sounds_In_General_Solution = undefined;
    this.ObjFineTuning.Sounds_In_General_FinalOutCome = undefined; 
    }
    if((this.selectedLoudness[0] != "Speech is too loud (speaker is too loud)") && 
       (this.selectedLoudness[1] != "Speech is too loud (speaker is too loud)") && 
       (this.selectedLoudness[2] != "Speech is too loud (speaker is too loud)")){
      this.ObjFineTuning.Speech_Is_TooLoud_Solution = undefined;
      this.ObjFineTuning.Speech_Is_TooLoud_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "High frequency sounds are too loud (dishes, rattling, paper rustling, water running)") && 
       (this.selectedLoudness[1] != "High frequency sounds are too loud (dishes, rattling, paper rustling, water running)") && 
       (this.selectedLoudness[2] != "High frequency sounds are too loud (dishes, rattling, paper rustling, water running)")){
      this.ObjFineTuning.HighFrequency_Sounds_Solution = undefined;
      this.ObjFineTuning.HighFrequency_Sounds_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "Low frequency sounds are too loud (toilet flushing, road noise, fans, etc.)") && 
       (this.selectedLoudness[1] != "Low frequency sounds are too loud (toilet flushing, road noise, fans, etc.)") && 
       (this.selectedLoudness[2] != "Low frequency sounds are too loud (toilet flushing, road noise, fans, etc.)")){
      this.ObjFineTuning.LowFrequency_Sounds_Solution = undefined;
      this.ObjFineTuning.LowFrequency_Sounds_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "The sounds of many people talking are too loud") && 
       (this.selectedLoudness[1] != "The sounds of many people talking are too loud") && 
       (this.selectedLoudness[2] != "The sounds of many people talking are too loud")){
      this.ObjFineTuning.SoundsOfMany_People_Solution = undefined;
      this.ObjFineTuning.SoundsOfMany_People_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] !=  "Loud sounds seem distorted") && 
       (this.selectedLoudness[1] !=  "Loud sounds seem distorted") && 
       (this.selectedLoudness[2] !=  "Loud sounds seem distorted")){
    this.ObjFineTuning.LoudSoundsSeem_Distorted_Solution = undefined;
    this.ObjFineTuning.LoudSoundsSeem_Distorted_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "Sudden noises are painfully loud") && 
       (this.selectedLoudness[1] != "Sudden noises are painfully loud") && 
       (this.selectedLoudness[2] != "Sudden noises are painfully loud")){
      this.ObjFineTuning.SuddenNoisesAre_Painfully_Solution = undefined;
      this.ObjFineTuning.SuddenNoisesAre_Painfully_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "All sounds are too soft") && 
       (this.selectedLoudness[1] != "All sounds are too soft") && 
       (this.selectedLoudness[2] != "All sounds are too soft")){
      this.ObjFineTuning.AllSoundsAre_TooSoft_Solution = undefined;
      this.ObjFineTuning.AllSoundsAre_TooSoft_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "Soft sounds are not audible in quite surroundings") && 
       (this.selectedLoudness[1] != "Soft sounds are not audible in quite surroundings") && 
       (this.selectedLoudness[2] != "Soft sounds are not audible in quite surroundings")){
      this.ObjFineTuning.SoftSounds_AreNot_Solution = undefined;
      this.ObjFineTuning.SoftSounds_AreNot_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "Soft speech is not audible") && 
       (this.selectedLoudness[1] != "Soft speech is not audible") && 
       (this.selectedLoudness[2] != "Soft speech is not audible")){
      this.ObjFineTuning.SoftSpeechIsNot_Audible_Solution = undefined;
      this.ObjFineTuning.SoftSpeechIsNot_Audible_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] !=  "Speech is Too Soft") && 
       (this.selectedLoudness[1] !=  "Speech is Too Soft") && 
       (this.selectedLoudness[2] !=  "Speech is Too Soft")){
      this.ObjFineTuning.SpeechIs_TooSoft_Solution = undefined;
      this.ObjFineTuning.SpeechIs_TooSoft_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "High frequency sounds are too soft (birdsong, doorbell, telephone ring)") && 
       (this.selectedLoudness[1] != "High frequency sounds are too soft (birdsong, doorbell, telephone ring)") && 
       (this.selectedLoudness[2] != "High frequency sounds are too soft (birdsong, doorbell, telephone ring)")){
      this.ObjFineTuning.HighFrequencySounds_AreTooSoft_Solution = undefined;
      this.ObjFineTuning.HighFrequencySounds_AreTooSoft_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "Volume control needs frequent adjustment") && 
       (this.selectedLoudness[1] != "Volume control needs frequent adjustment") && 
       (this.selectedLoudness[2] != "Volume control needs frequent adjustment")){
      this.ObjFineTuning.VolumeControl_Needs_Solution = undefined;
      this.ObjFineTuning.VolumeControl_Needs_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "Wind noise is too loud") && 
       (this.selectedLoudness[1] != "Wind noise is too loud") && 
       (this.selectedLoudness[2] != "Wind noise is too loud")){
      this.ObjFineTuning.WindNoise_Solution = undefined;
      this.ObjFineTuning.WindNoise_FinalOutcome = undefined; 
    }
    if((this.selectedLoudness[0] != "Ambient noise is too noticeable in quite surroundings") && 
       (this.selectedLoudness[1] != "Ambient noise is too noticeable in quite surroundings") && 
       (this.selectedLoudness[2] != "Ambient noise is too noticeable in quite surroundings")){
      this.ObjFineTuning.Ambient_Noise_Solution = undefined;
      this.ObjFineTuning.Ambient_Noise_FinalOutcome = undefined; 
    }  

  }

  undefined2(){

    if((this.SelectedSoundQuality[0] !=  "Speech is unclear/muffled") && 
       (this.SelectedSoundQuality[1] !=  "Speech is unclear/muffled") && 
       (this.SelectedSoundQuality[2] !=  "Speech is unclear/muffled")){
    this.ObjFineTuning.SpeechIs_Unclear_Solution = undefined;
    this.ObjFineTuning.SpeechIs_Unclear_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Speech is boomy or has an echo") && 
       (this.SelectedSoundQuality[1] !=  "Speech is boomy or has an echo") && 
       (this.SelectedSoundQuality[2] !=  "Speech is boomy or has an echo")){
    this.ObjFineTuning.SpeechIs_Boomy_Solution = undefined;
    this.ObjFineTuning.SpeechIs_Boomy_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Male voices sound boomy") && 
       (this.SelectedSoundQuality[1] !=  "Male voices sound boomy") && 
       (this.SelectedSoundQuality[2] !=  "Male voices sound boomy")){
    this.ObjFineTuning.MaleVoices_Boomy_Solution = undefined;
    this.ObjFineTuning.MaleVoices_Boomy_FinalOutcome = undefined; 
    }
    if((this.SelectedSoundQuality[0] !=  "Male voices sound tinny or metallic") && 
       (this.SelectedSoundQuality[1] !=  "Male voices sound tinny or metallic") && 
       (this.SelectedSoundQuality[2] !=  "Male voices sound tinny or metallic")){
    this.ObjFineTuning.MaleVoices_Tinny_Solution = undefined;
    this.ObjFineTuning.MaleVoices_Tinny_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Male voices sound dull") && 
       (this.SelectedSoundQuality[1] !=  "Male voices sound dull") && 
       (this.SelectedSoundQuality[2] !=  "Male voices sound dull")){
    this.ObjFineTuning.MaleVoices_Dull_Solution = undefined;
    this.ObjFineTuning.MaleVoices_Dull_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Male voices sound hollow") && 
       (this.SelectedSoundQuality[1] !=  "Male voices sound hollow") && 
       (this.SelectedSoundQuality[2] !=  "Male voices sound hollow")){
    this.ObjFineTuning.MaleVoices_Hollow_Solution = undefined;
    this.ObjFineTuning.MaleVoices_Hollow_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Male voices sound sharp") && 
       (this.SelectedSoundQuality[1] !=  "Male voices sound sharp") && 
       (this.SelectedSoundQuality[2] !=  "Male voices sound sharp")){
    this.ObjFineTuning.MaleVoices_Sharp_Solution = undefined;
    this.ObjFineTuning.MaleVoices_Sharp_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Own voices sound sharp") && 
       (this.SelectedSoundQuality[1] !=  "Own voices sound sharp") && 
       (this.SelectedSoundQuality[2] !=  "Own voices sound sharp")){
    this.ObjFineTuning.OwnVoices_Sharp_Solution = undefined;
    this.ObjFineTuning.OwnVoices_Sharp_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Own voice sounds as if speaking “in a barrel” or has an “echo”") && 
       (this.SelectedSoundQuality[1] !=  "Own voice sounds as if speaking “in a barrel” or has an “echo”") && 
       (this.SelectedSoundQuality[2] !=  "Own voice sounds as if speaking “in a barrel” or has an “echo”")){
    this.ObjFineTuning.OwnVoices_Barrel_Solution = undefined;
    this.ObjFineTuning.OwnVoices_Barrel_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Own voice sounds “stuffed up” or “closed”") && 
       (this.SelectedSoundQuality[1] !=  "Own voice sounds “stuffed up” or “closed”") && 
       (this.SelectedSoundQuality[2] !=  "Own voice sounds “stuffed up” or “closed”")){
    this.ObjFineTuning.OwnVoices_Stuffing_Solution = undefined;
    this.ObjFineTuning.OwnVoices_Stuffing_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Own voice is not acceptable") && 
       (this.SelectedSoundQuality[1] !=  "Own voice is not acceptable") && 
       (this.SelectedSoundQuality[2] !=  "Own voice is not acceptable")){
    this.ObjFineTuning.OwnVoicesNot_Accepct_Solution = undefined;
    this.ObjFineTuning.OwnVoicesNot_Accepct_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Female voices sound tinny or metallic") && 
       (this.SelectedSoundQuality[1] !=  "Female voices sound tinny or metallic") && 
       (this.SelectedSoundQuality[2] !=  "Female voices sound tinny or metallic")){
    this.ObjFineTuning.FemaleVoice_Tinny_Solution = undefined;
    this.ObjFineTuning.FemaleVoice_Tinny_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Female voices sound dull") && 
       (this.SelectedSoundQuality[1] !=  "Female voices sound dull") && 
       (this.SelectedSoundQuality[2] !=  "Female voices sound dull")){
    this.ObjFineTuning.FemaleVoice_Dull_Solution = undefined;
    this.ObjFineTuning.FemaleVoice_Dull_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Female voices sound hollow") && 
       (this.SelectedSoundQuality[1] !=  "Female voices sound hollow") && 
       (this.SelectedSoundQuality[2] !=  "Female voices sound hollow")){
    this.ObjFineTuning.FemaleVoice_Hollow_Solution = undefined;
    this.ObjFineTuning.FemaleVoice_Hollow_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Music sound boomy") && 
       (this.SelectedSoundQuality[1] !=  "Music sound boomy") && 
       (this.SelectedSoundQuality[2] !=  "Music sound boomy")){
    this.ObjFineTuning.MusicSound_Boomy_Solution = undefined;
    this.ObjFineTuning.MusicSound_Boomy_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Music sound tinny or metallic") && 
       (this.SelectedSoundQuality[1] !=  "Music sound tinny or metallic") && 
       (this.SelectedSoundQuality[2] !=  "Music sound tinny or metallic")){
    this.ObjFineTuning.MusicSound_Tinny_Solution = undefined;
    this.ObjFineTuning.MusicSound_Tinny_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Music sound dull") && 
       (this.SelectedSoundQuality[1] !=  "Music sound dull") && 
       (this.SelectedSoundQuality[2] !=  "Music sound dull")){
    this.ObjFineTuning.MusicSound_Dull_Solution = undefined;
    this.ObjFineTuning.MusicSound_Dull_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Music sound hollow") && 
       (this.SelectedSoundQuality[1] !=  "Music sound hollow") && 
       (this.SelectedSoundQuality[2] !=  "Music sound hollow")){
    this.ObjFineTuning.MusicSound_Hollow_Solution = undefined;
    this.ObjFineTuning.MusicSound_Hollow_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "Music sound sharp") && 
       (this.SelectedSoundQuality[1] !=  "Music sound sharp") && 
       (this.SelectedSoundQuality[2] !=  "Music sound sharp")){
    this.ObjFineTuning.MusicSound_Sharp_Solution = undefined;
    this.ObjFineTuning.MusicSound_Sharp_FinalOutcome = undefined; 
    }

    if((this.SelectedSoundQuality[0] !=  "High frequency sounds are dull") && 
       (this.SelectedSoundQuality[1] !=  "High frequency sounds are dull") && 
       (this.SelectedSoundQuality[2] !=  "High frequency sounds are dull")){
    this.ObjFineTuning.HighFrequencySoundsAre_Dull_Solution = undefined;
    this.ObjFineTuning.HighFrequencySoundsAre_Dull_FinalOutcome = undefined; 
    }

  }

  undefined3(){

  if((this.SelectedSpeechIntelligibility[0] !=  "Speech is unclear in moderate background noise") && 
     (this.SelectedSpeechIntelligibility[1] !=  "Speech is unclear in moderate background noise") && 
     (this.SelectedSpeechIntelligibility[2] !=  "Speech is unclear in moderate background noise")){
    this.ObjFineTuning.SpeechIs_Moderate_Solution = undefined;
    this.ObjFineTuning.SpeechIs_Moderate_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] != "Understanding speech when in a car, train, airplane, etc. is difficult") && 
     (this.SelectedSpeechIntelligibility[1] != "Understanding speech when in a car, train, airplane, etc. is difficult") && 
     (this.SelectedSpeechIntelligibility[2] != "Understanding speech when in a car, train, airplane, etc. is difficult")){
    this.ObjFineTuning.Understanding_Speech_Solution = undefined;
    this.ObjFineTuning.Understanding_Speech_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] != "Distance voices/sounds seem louder than voices/sounds nearby") && 
     (this.SelectedSpeechIntelligibility[1] != "Distance voices/sounds seem louder than voices/sounds nearby") && 
     (this.SelectedSpeechIntelligibility[2] != "Distance voices/sounds seem louder than voices/sounds nearby")){
    this.ObjFineTuning.Distance_Voice_Solution = undefined;
    this.ObjFineTuning.Distance_Voice_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] != "Understanding a speaker who is far away is difficult") && 
     (this.SelectedSpeechIntelligibility[1] != "Understanding a speaker who is far away is difficult") && 
     (this.SelectedSpeechIntelligibility[2] != "Understanding a speaker who is far away is difficult")){
    this.ObjFineTuning.Understandings_Speaker_Solution = undefined;
    this.ObjFineTuning.Understandings_Speaker_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] != "Hear distance speech better than close speech") && 
     (this.SelectedSpeechIntelligibility[1] != "Hear distance speech better than close speech") && 
     (this.SelectedSpeechIntelligibility[2] != "Hear distance speech better than close speech")){
    this.ObjFineTuning.HearDistance_Speech_Solution = undefined;
    this.ObjFineTuning.HearDistance_Speech_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] !=  "Sound localization is difficult") && 
     (this.SelectedSpeechIntelligibility[1] !=  "Sound localization is difficult") && 
     (this.SelectedSpeechIntelligibility[2] !=  "Sound localization is difficult")){
    this.ObjFineTuning.Sound_Localization_Solution = undefined;
    this.ObjFineTuning.Sound_Localization_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] !=  "Poor speech perception in noise (raised speech seems muffled or dampened)") && 
     (this.SelectedSpeechIntelligibility[1] !=  "Poor speech perception in noise (raised speech seems muffled or dampened)") && 
     (this.SelectedSpeechIntelligibility[2] !=  "Poor speech perception in noise (raised speech seems muffled or dampened)")){
    this.ObjFineTuning.PoorSpeech_Perception_Solution = undefined;
    this.ObjFineTuning.PoorSpeech_Perception_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] !=  "Sound is turned down too much in noisy environments") && 
     (this.SelectedSpeechIntelligibility[1] !=  "Sound is turned down too much in noisy environments") && 
     (this.SelectedSpeechIntelligibility[2] !=  "Sound is turned down too much in noisy environments")){
    this.ObjFineTuning.SoundTurned_Down_Solution = undefined;
    this.ObjFineTuning.SoundTurned_Down_FinalOutcome = undefined; 
  }
  if((this.SelectedSpeechIntelligibility[0] !=  "Sound is distorted or very uncomfortable in noisy environments") && 
     (this.SelectedSpeechIntelligibility[1] !=  "Sound is distorted or very uncomfortable in noisy environments") && 
     (this.SelectedSpeechIntelligibility[2] !=  "Sound is distorted or very uncomfortable in noisy environments")){
    this.ObjFineTuning. Sound_Distorted_Solution = undefined;
    this.ObjFineTuning.Sound_Distorted_FinalOutcome = undefined; 
  }

  }

  undefined4(){

    if((this.SelectedFeedback[0] !=  "Hearing aid whistles occasionally, e.g. when hugging a person, putting on a hat or while chewing") && 
       (this.SelectedFeedback[1] !=  "Hearing aid whistles occasionally, e.g. when hugging a person, putting on a hat or while chewing") && 
       (this.SelectedFeedback[2] !=  "Hearing aid whistles occasionally, e.g. when hugging a person, putting on a hat or while chewing")){
    this.ObjFineTuning.Hearing_Occasionally_Solution = undefined;
    this.ObjFineTuning.Hearing_Occasionally_FinalOutcome = undefined; 
    }
    if((this.SelectedFeedback[0] != "Feedback occurs with the use of the telephone and/or other dynamic situations") && 
       (this.SelectedFeedback[1] != "Feedback occurs with the use of the telephone and/or other dynamic situations") && 
       (this.SelectedFeedback[2] != "Feedback occurs with the use of the telephone and/or other dynamic situations")){
      this.ObjFineTuning.Feedback_Occurs_Solution = undefined;
      this.ObjFineTuning.Feedback_Occurs_FinalOutcome = undefined; 
    }
    if((this.SelectedFeedback[0] != "Hearing aid whistles unprovoked") && 
       (this.SelectedFeedback[1] != "Hearing aid whistles unprovoked") && 
       (this.SelectedFeedback[2] != "Hearing aid whistles unprovoked")){
      this.ObjFineTuning.Hearing_Whistles_Solution = undefined;
      this.ObjFineTuning.Hearing_Whistles_FinalOutcome = undefined; 
    }

  }

  undefined5(){

    if((this.SelectedTinnitus[0] !=  "ZEN tone/TSG synchronization white noise is too soft") && 
       (this.SelectedTinnitus[1] !=  "ZEN tone/TSG synchronization white noise is too soft") && 
       (this.SelectedTinnitus[2] !=  "ZEN tone/TSG synchronization white noise is too soft")){
      this.ObjFineTuning.ZENTone_Synchronization_Solution = undefined;
      this.ObjFineTuning.ZENTone_Synchronization_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "ZEN tone/TSG synchronization white noise is too loud") && 
       (this.SelectedTinnitus[1] !=  "ZEN tone/TSG synchronization white noise is too loud") && 
       (this.SelectedTinnitus[2] !=  "ZEN tone/TSG synchronization white noise is too loud")){
      this.ObjFineTuning.ZENToneSynchronizationK_Loud_Solution = undefined;
      this.ObjFineTuning.ZENToneSynchronizationK_Loud_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "Broadband stimulation is not effective") && 
       (this.SelectedTinnitus[1] !=  "Broadband stimulation is not effective") && 
       (this.SelectedTinnitus[2] !=  "Broadband stimulation is not effective")){
      this.ObjFineTuning.Broadband_Stimulation_Solution = undefined;
      this.ObjFineTuning.Broadband_Stimulation_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "ZEN tone/White noise is not effectively interacting with the tinnitus") && 
       (this.SelectedTinnitus[1] !=  "ZEN tone/White noise is not effectively interacting with the tinnitus") && 
       (this.SelectedTinnitus[2] !=  "ZEN tone/White noise is not effectively interacting with the tinnitus")){
      this.ObjFineTuning.ZENToneWhite_Noise_Solution = undefined;
      this.ObjFineTuning.ZENToneWhite_Noise_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "ZEN tone/Continuous stimulation is bothersome") && 
       (this.SelectedTinnitus[1] !=  "ZEN tone/Continuous stimulation is bothersome") && 
       (this.SelectedTinnitus[2] !=  "ZEN tone/Continuous stimulation is bothersome")){
      this.ObjFineTuning.ZENToneContinuous_Stimulation_Solution = undefined;
      this.ObjFineTuning.ZENToneContinuous_Stimulation_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "Amplitude modulation is bothersome") && 
       (this.SelectedTinnitus[1] !=  "Amplitude modulation is bothersome") && 
       (this.SelectedTinnitus[2] !=  "Amplitude modulation is bothersome")){
      this.ObjFineTuning.TSGWhite_Noise_Solution = undefined;
      this.ObjFineTuning.TSGWhite_Noise_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "Other stimuli besides ZEN tone/white noise are helpful") && 
       (this.SelectedTinnitus[1] !=  "Other stimuli besides ZEN tone/white noise are helpful") && 
       (this.SelectedTinnitus[2] !=  "Other stimuli besides ZEN tone/white noise are helpful")){
      this.ObjFineTuning.Amplitude_Modulation_Solution = undefined;
      this.ObjFineTuning.Amplitude_Modulation_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "Tinnitus seems worse") && 
       (this.SelectedTinnitus[1] !=  "Tinnitus seems worse") && 
       (this.SelectedTinnitus[2] !=  "Tinnitus seems worse")){
      this.ObjFineTuning.Stimuli_Besides_Solution = undefined;
      this.ObjFineTuning.Stimuli_Besides_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "The patient is requesting an automatic volume control adjustment for TSG") && 
       (this.SelectedTinnitus[1] !=  "The patient is requesting an automatic volume control adjustment for TSG") && 
       (this.SelectedTinnitus[2] !=  "The patient is requesting an automatic volume control adjustment for TSG")){
      this.ObjFineTuning.TinnitusSeems_Worse_Solution = undefined;
      this.ObjFineTuning.TinnitusSeems_Worse_FinalOutcome = undefined; 
    }
    if((this.SelectedTinnitus[0] !=  "ZEN tone/TSG white noise interferes with speech") && 
       (this.SelectedTinnitus[1] !=  "ZEN tone/TSG white noise interferes with speech") && 
       (this.SelectedTinnitus[2] !=  "ZEN tone/TSG white noise interferes with speech")){
      this.ObjFineTuning.Patient_Requesting_Solution = undefined;
      this.ObjFineTuning.Patient_Requesting_FinalOutcome = undefined; 
    }

  }

  undefined6(){

    if((this.SelectedWirelessAccessories[0] !=  "Micro/Mini/Multi mic is too noisy") && 
       (this.SelectedWirelessAccessories[1] !=  "Micro/Mini/Multi mic is too noisy")){
    this.ObjFineTuning.MicroMiniMulti_Noise_Solution = undefined;
    this.ObjFineTuning.MicroMiniMulti_Noise_FinalOutcome = undefined; 
    }
    if((this.SelectedWirelessAccessories[0] != "Phone clip is not functional or loud enough") && 
       (this.SelectedWirelessAccessories[1] != "Phone clip is not functional or loud enough")){
      this.ObjFineTuning.PhoneClip_Solution = undefined;
      this.ObjFineTuning.PhoneClip_FinalOutcome = undefined; 
    }

  }

  undefined7(){

      if  ((this.SelectedSynchronizedFunctionality[0] !=  "The patient would like to separate functionality for each ear") && 
          (this.SelectedSynchronizedFunctionality[1] !=  "The patient would like to separate functionality for each ear") ){
        this.ObjFineTuning.functionality_EachEar_Solution = undefined;
        this.ObjFineTuning.functionality_EachEar_FinalOutcome = undefined; 
      }

      if  ((this.SelectedSynchronizedFunctionality[0] !=  "Synched push bottom/volume control is not functioning") && 
          (this.SelectedSynchronizedFunctionality[1] !=  "Synched push bottom/volume control is not functioning") ){
      this.ObjFineTuning.SynchedPush_Bottom_Solution = undefined;
      this.ObjFineTuning.SynchedPush_Bottom_FinalOutcome = undefined; 
      }

  }

  undefined8(){

    if  ((this.SelectedPhysicalFit[0] !=  "The earpiece slips out of the ear") && 
         (this.SelectedPhysicalFit[1] !=  "The earpiece slips out of the ear") && 
         (this.SelectedPhysicalFit[2] !=  "The earpiece slips out of the ear")
          ){
      this.ObjFineTuning.Slips_OutEar_Solution = undefined;
      this.ObjFineTuning.Slips_OutEar_FinalOutcome = undefined; 
    }
    if  ((this.SelectedPhysicalFit[0] !=  "The ear piece causes irritation or pain in the ear") && 
          (this.SelectedPhysicalFit[1] !=  "The ear piece causes irritation or pain in the ear") && 
          (this.SelectedPhysicalFit[2] !=  "The ear piece causes irritation or pain in the ear")
          ){
        this.ObjFineTuning.PainInEar_Solution = undefined;
        this.ObjFineTuning.PainInEar_FinalOutcome = undefined; 
    }
    if  ((this.SelectedPhysicalFit[0] !=  "Patient has difficulties placing the hearing aid or earpiece in the ear") && 
          (this.SelectedPhysicalFit[1] !=  "Patient has difficulties placing the hearing aid or earpiece in the ear") && 
          (this.SelectedPhysicalFit[2] !=  "Patient has difficulties placing the hearing aid or earpiece in the ear")
          ){
        this.ObjFineTuning.EarpieceIn_Ear_Solution = undefined;
        this.ObjFineTuning.EarpieceIn_Ear_FinalOutcome = undefined; 
    }
  
  }

  undefined9(){

    if((this.SelectedHearingAid[0] !=  "Patient has difficulties using the program button") && 
       (this.SelectedHearingAid[1] !=  "Patient has difficulties using the program button") && 
       (this.SelectedHearingAid[2] !=  "Patient has difficulties using the program button")){
    this.ObjFineTuning.UsingProgram_Button_Solution = undefined;
    this.ObjFineTuning.UsingProgram_Button_FinalOutcome = undefined; 
    }
    if((this.SelectedHearingAid[0] != "Patient has difficulties using the preference control") && 
       (this.SelectedHearingAid[1] != "Patient has difficulties using the preference control") && 
       (this.SelectedHearingAid[2] != "Patient has difficulties using the preference control")){
      this.ObjFineTuning.Preference_Control_Solution = undefined;
      this.ObjFineTuning.Preference_Control_FinalOutcome = undefined; 
    }
    if((this.SelectedHearingAid[0] != "Patient has difficulties turning the hearing aid on and off") && 
       (this.SelectedHearingAid[1] != "Patient has difficulties turning the hearing aid on and off") && 
       (this.SelectedHearingAid[2] != "Patient has difficulties turning the hearing aid on and off")){
      this.ObjFineTuning.Hearing_OnOff_Solution = undefined;
      this.ObjFineTuning.Hearing_OnOff_FinalOutcome = undefined; 
    }
    if((this.SelectedHearingAid[0] != "Client has difficulties changing batteries") && 
       (this.SelectedHearingAid[1] != "Client has difficulties changing batteries") && 
       (this.SelectedHearingAid[2] != "Client has difficulties changing batteries")){
      this.ObjFineTuning.Changing_Batteries_Solution = undefined;
      this.ObjFineTuning.Changing_Batteries_FinalOutcome = undefined; 
    }
    if((this.SelectedHearingAid[0] != "Client has difficulties changing wax protection system") && 
       (this.SelectedHearingAid[1] != "Client has difficulties changing wax protection system") && 
       (this.SelectedHearingAid[2] != "Client has difficulties changing wax protection system")){
      this.ObjFineTuning.Protection_System_Solution = undefined;
      this.ObjFineTuning.Protection_System_FinalOutcome = undefined; 
    }

  }

  undefined10(){

    if((this.SelectedOthers[0] != "No sound from the hearing aid")){
        this.ObjFineTuning.NoSound_Solution = undefined;
        this.ObjFineTuning.NoSound_FinalOutcome = undefined; 
      }

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
  Distance_Voice_FinalOutcome: any;
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
  Prints:any
}