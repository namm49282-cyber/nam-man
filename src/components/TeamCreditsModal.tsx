import React, { useEffect } from 'react';
import { Award, Code2, Cpu, GraduationCap, ShieldCheck, X } from 'lucide-react';
import { LocaleCode } from '../types/artifact';

interface TeamCreditsModalProps {
  locale: LocaleCode;
  isOpen: boolean;
  onClose: () => void;
}

interface TeamCreditsFooterTriggerProps {
  locale: LocaleCode;
  onOpen: () => void;
}

interface LocalizedMember {
  tag: string;
  name: string;
  role: string;
}

interface LocalizedCreditsContent {
  dir: 'rtl' | 'ltr';
  iconTitle: string;
  prominentStatement: string;
  openScreenHint: string;
  modalKicker: string;
  studentsSectionTitle: string;
  students: [LocalizedMember, LocalizedMember, LocalizedMember];
  supervisionSectionTitle: string;
  supportSupervisor: LocalizedMember;
  followupSupervisor: LocalizedMember;
  generalSupervisor: LocalizedMember;
  modalFooterNote: string;
  closeLabel: string;
}

export const TEAM_CREDITS_I18N: Record<LocaleCode, LocalizedCreditsContent> = {
  ar: {
    dir: 'rtl',
    iconTitle: 'برمجة وتصميم',
    prominentStatement:
      'تصميم وبرمجة فريق الروبوت الطلاب بالمعهد الديني للعام 2026 - 2027',
    openScreenHint: 'اضغط لعرض شاشة أسماء الفريق والإشراف',
    modalKicker: 'المعهد الديني · العام الدراسي 2026 - 2027',
    studentsSectionTitle: 'فريق الروبوت الطلابي — تصميم وبرمجة المنصة',
    students: [
      {
        tag: 'الطالب ١',
        name: 'صقر الجودر',
        role: 'عضو فريق الروبوت الطلابي · تصميم وبرمجة',
      },
      {
        tag: 'الطالب ٢',
        name: 'حسن العباسي',
        role: 'عضو فريق الروبوت الطلابي · تصميم وبرمجة',
      },
      {
        tag: 'الطالب ٣',
        name: 'محمد آل محمود',
        role: 'عضو فريق الروبوت الطلابي · تصميم وبرمجة',
      },
    ],
    supervisionSectionTitle: 'الدعم التكنولوجي والمتابعة والإشراف العام',
    supportSupervisor: {
      tag: 'دعم وإشراف',
      name: 'أ. محمد عبد الوهاب محمد عبيد',
      role: 'اختصاصي تكنولوجيا',
    },
    followupSupervisor: {
      tag: 'متابعة',
      name: 'د. محمود أحمد آل محمود',
      role: 'رئيس فريق التمكين الرقمي - المدير المساعد',
    },
    generalSupervisor: {
      tag: 'إشراف عام',
      name: 'دكتور هشام حسين راشد الرميثي',
      role: 'مدير المعهد الديني',
    },
    modalFooterNote: 'منصة الحارس الذكي (Smart Guardian) · المعهد الديني 2026 - 2027',
    closeLabel: 'إغلاق',
  },

  'en-US': {
    dir: 'ltr',
    iconTitle: 'Design & Programming',
    prominentStatement:
      'Designed & Programmed by the Student Robotics Team at the Religious Institute (2026 – 2027)',
    openScreenHint: 'Click to open the Team & Supervision screen',
    modalKicker: 'Religious Institute · Academic Year 2026 – 2027',
    studentsSectionTitle: 'Student Robotics Team — Platform Design & Programming',
    students: [
      {
        tag: 'Student 1',
        name: 'Saqr Al-Jowder',
        role: 'Student Robotics Team · Design & Programming',
      },
      {
        tag: 'Student 2',
        name: 'Hassan Al-Abbasi',
        role: 'Student Robotics Team · Design & Programming',
      },
      {
        tag: 'Student 3',
        name: 'Mohammed Al-Mahmoud',
        role: 'Student Robotics Team · Design & Programming',
      },
    ],
    supervisionSectionTitle: 'Technical Support, Follow-up & General Supervision',
    supportSupervisor: {
      tag: 'Support & Supervision',
      name: 'Mr. Mohammed Abdulwahab Mohammed Obaid',
      role: 'Technology Specialist',
    },
    followupSupervisor: {
      tag: 'Follow-up',
      name: 'Dr. Mahmoud Ahmed Al-Mahmoud',
      role: 'Head of Digital Empowerment Team – Assistant Director',
    },
    generalSupervisor: {
      tag: 'General Supervision',
      name: 'Dr. Hisham Hussein Rashid Al-Rumaithi',
      role: 'Director of the Religious Institute',
    },
    modalFooterNote: 'Smart Guardian Platform · Religious Institute 2026 – 2027',
    closeLabel: 'Close',
  },

  fr: {
    dir: 'ltr',
    iconTitle: 'Conception & Programmation',
    prominentStatement:
      'Conception et programmation par l’équipe robotique étudiante de l’Institut Religieux (2026 – 2027)',
    openScreenHint: 'Cliquez pour afficher les membres de l’équipe et la supervision',
    modalKicker: 'Institut Religieux · Année Académique 2026 – 2027',
    studentsSectionTitle: 'Équipe Robotique Étudiante — Conception & Programmation',
    students: [
      {
        tag: 'Étudiant 1',
        name: 'Saqr Al-Jowder',
        role: 'Équipe Robotique Étudiante · Conception & Programmation',
      },
      {
        tag: 'Étudiant 2',
        name: 'Hassan Al-Abbasi',
        role: 'Équipe Robotique Étudiante · Conception & Programmation',
      },
      {
        tag: 'Étudiant 3',
        name: 'Mohammed Al-Mahmoud',
        role: 'Équipe Robotique Étudiante · Conception & Programmation',
      },
    ],
    supervisionSectionTitle: 'Soutien Technologique, Suivi & Supervision Générale',
    supportSupervisor: {
      tag: 'Soutien & Encadrement',
      name: 'M. Mohammed Abdulwahab Mohammed Obaid',
      role: 'Spécialiste en Technologie',
    },
    followupSupervisor: {
      tag: 'Suivi',
      name: 'Dr Mahmoud Ahmed Al-Mahmoud',
      role: 'Chef de l’Équipe d’Autonomisation Numérique – Directeur Adjoint',
    },
    generalSupervisor: {
      tag: 'Supervision Générale',
      name: 'Dr Hisham Hussein Rashid Al-Rumaithi',
      role: 'Directeur de l’Institut Religieux',
    },
    modalFooterNote: 'Plateforme Smart Guardian · Institut Religieux 2026 – 2027',
    closeLabel: 'Fermer',
  },

  zh: {
    dir: 'ltr',
    iconTitle: '设计与编程',
    prominentStatement:
      '宗教研究院学生机器人团队设计与编程（2026 – 2027 学年）',
    openScreenHint: '点击查看研发学生团队与指导专家名单',
    modalKicker: '宗教研究院 · 2026 – 2027 学年',
    studentsSectionTitle: '学生机器人团队 — 平台设计与程序开发',
    students: [
      {
        tag: '学生 1',
        name: '萨克尔·贾乌德尔 (Saqr Al-Jowder)',
        role: '学生机器人团队成员 · 设计与编程',
      },
      {
        tag: '学生 2',
        name: '哈桑·阿巴斯 (Hassan Al-Abbasi)',
        role: '学生机器人团队成员 · 设计与编程',
      },
      {
        tag: '学生 3',
        name: '穆罕默德·阿勒马哈茂德 (Mohammed Al-Mahmoud)',
        role: '学生机器人团队成员 · 设计与编程',
      },
    ],
    supervisionSectionTitle: '技术支持、项目督导与总督导',
    supportSupervisor: {
      tag: '支持与指导',
      name: '穆罕默德·阿卜杜勒瓦哈卜·穆罕默德·奥贝德 老师',
      role: '技术专家',
    },
    followupSupervisor: {
      tag: '跟进督导',
      name: '马哈茂德·艾哈迈德·阿勒马哈茂德 博士',
      role: '数字赋能团队负责人 — 副校长',
    },
    generalSupervisor: {
      tag: '总督导',
      name: '希沙姆·侯赛因·拉希德·鲁迈西 博士',
      role: '宗教研究院院长（校长）',
    },
    modalFooterNote: 'Smart Guardian 智慧守护者平台 · 宗教研究院 2026 – 2027',
    closeLabel: '关闭',
  },

  ru: {
    dir: 'ltr',
    iconTitle: 'Дизайн и разработка',
    prominentStatement:
      'Дизайн и программирование: студенческая команда робототехники Религиозного института (2026 – 2027)',
    openScreenHint: 'Нажмите, чтобы открыть состав команды и руководителей',
    modalKicker: 'Религиозный институт · 2026 – 2027 учебный год',
    studentsSectionTitle:
      'Студенческая команда робототехники — дизайн и программирование',
    students: [
      {
        tag: 'Ученик 1',
        name: 'Сакр Аль-Джаудар',
        role: 'Студенческая команда робототехники · дизайн и код',
      },
      {
        tag: 'Ученик 2',
        name: 'Хасан Аль-Аббаси',
        role: 'Студенческая команда робототехники · дизайн и код',
      },
      {
        tag: 'Ученик 3',
        name: 'Мухаммад Аль-Махмуд',
        role: 'Студенческая команда робототехники · дизайн и код',
      },
    ],
    supervisionSectionTitle:
      'Техническая поддержка, кураторство и общее руководство',
    supportSupervisor: {
      tag: 'Поддержка и наставничество',
      name: 'Г-н Мухаммад Абдулваххаб Мухаммад Обейд',
      role: 'Специалист по технологиям',
    },
    followupSupervisor: {
      tag: 'Кураторство и контроль',
      name: 'Д-р Махмуд Ахмед Аль-Махмуд',
      role: 'Руководитель группы цифрового развития — заместитель директора',
    },
    generalSupervisor: {
      tag: 'Общее руководство',
      name: 'Д-р Хишам Хусейн Рашид Аль-Румайси',
      role: 'Директор Религиозного института',
    },
    modalFooterNote:
      'Платформа Smart Guardian · Религиозный институт 2026 – 2027',
    closeLabel: 'Закрыть',
  },
};

export const TeamCreditsFooterBar: React.FC<TeamCreditsFooterTriggerProps> = ({
  locale,
  onOpen,
}) => {
  const copy = TEAM_CREDITS_I18N[locale];
  const isRtl = copy.dir === 'rtl';

  return (
    <button
      type="button"
      dir={copy.dir}
      onClick={onOpen}
      className={`group w-full ${
        isRtl ? 'text-right' : 'text-left'
      } bg-gradient-to-b from-white to-[#F7F1E5] hover:to-[#EFE6D4] border border-[#C89E54]/70 hover:border-[#9E6E24] rounded-2xl p-4 sm:px-6 sm:py-4.5 shadow-[0_3px_14px_rgba(28,24,20,0.06)] transition-all duration-150 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C45]`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Prominent Icon Badge under localized title "برمجة وتصميم" */}
          <div className="flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl bg-gradient-to-b from-[#165E56] to-[#0D423C] border border-[#09302B] text-[#FBF9F5] shrink-0 shadow-[0_2px_8px_rgba(13,66,60,0.22)]">
            <Code2 className="w-6 h-6 mb-1 text-[#F3D28C]" />
            <span className="text-[11px] font-bold whitespace-nowrap tracking-wide">
              {copy.iconTitle}
            </span>
          </div>

          <div>
            <p className="font-honor-display text-xl sm:text-[1.6rem] font-bold text-[#1C1814] leading-snug">
              {copy.prominentStatement}
            </p>
            <p className="font-honor-role text-xs text-[#0F4C45] mt-1">
              {copy.openScreenHint}
            </p>
          </div>
        </div>

        <div className="hidden md:inline-flex btn-guardian-brass px-4 py-2 text-xs">
          <Award className="w-4 h-4 text-[#9E6E24] shrink-0" />
          <span>{copy.iconTitle}</span>
        </div>
      </div>
    </button>
  );
};

export const TeamCreditsModal: React.FC<TeamCreditsModalProps> = ({
  locale,
  isOpen,
  onClose,
}) => {
  const copy = TEAM_CREDITS_I18N[locale];
  const isRtl = copy.dir === 'rtl';

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-credits-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        dir={copy.dir}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl bg-[#FBF9F5] border-2 border-[#C89E54]/65 rounded-2xl overflow-hidden shadow-2xl my-auto ${
          isRtl ? 'text-right' : 'text-left'
        }`}
      >
        {/* Top Institutional Banner */}
        <div className="bg-gradient-to-b from-[#165E56] to-[#0D423C] text-[#FBF9F5] px-6 py-5 flex items-start justify-between gap-4 border-b-2 border-[#C89E54]">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-[#F3D28C]/35 flex items-center justify-center shrink-0">
              <Code2 className="w-6 h-6 text-[#F3D28C]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F3D28C] mb-1">
                {copy.iconTitle} · {copy.modalKicker}
              </p>
              <h2
                id="team-credits-modal-title"
                className="font-honor-display text-xl sm:text-3xl font-bold text-[#FBF9F5] leading-snug"
              >
                {copy.prominentStatement}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeLabel}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FBF9F5] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Students Section */}
          <div>
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#DED4C3]">
              <Cpu className="w-4 h-4 text-[#0F4C45] shrink-0" />
              <h3 className="font-honor-role text-sm sm:text-base font-bold text-[#0F4C45]">
                {copy.studentsSectionTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {copy.students.map((st) => (
                <div
                  key={st.tag}
                  className="bg-white border border-[#D8CCB7] rounded-2xl p-4 text-center flex flex-col justify-between shadow-[0_2px_8px_rgba(28,24,20,0.04)]"
                >
                  <div>
                    <p className="font-mono text-xs font-bold text-[#9E6E24] mb-2">
                      {st.tag}
                    </p>
                    <p className="font-honor-display text-xl sm:text-2xl font-bold text-[#1C1814] mb-1.5">
                      {st.name}
                    </p>
                  </div>
                  <p className="font-honor-role text-xs text-[#5C5247] pt-2.5 border-t border-[#EAE1D2]">
                    {st.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Supervision & Leadership Hierarchy */}
          <div>
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#DED4C3]">
              <GraduationCap className="w-4 h-4 text-[#9E6E24] shrink-0" />
              <h3 className="font-honor-role text-sm sm:text-base font-bold text-[#1C1814]">
                {copy.supervisionSectionTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Support & Technical Supervision */}
              <div className="bg-white border border-[#D8CCB7] rounded-2xl p-4.5 flex flex-col justify-between shadow-[0_2px_8px_rgba(28,24,20,0.04)]">
                <div>
                  <p className="text-xs font-bold text-[#0F4C45] mb-1">
                    {copy.supportSupervisor.tag}
                  </p>
                  <p className="font-honor-display text-xl sm:text-2xl font-bold text-[#1C1814] mb-2">
                    {copy.supportSupervisor.name}
                  </p>
                </div>
                <p className="font-honor-role text-xs sm:text-sm font-semibold text-[#9E6E24] pt-2.5 border-t border-[#EAE1D2]">
                  {copy.supportSupervisor.role}
                </p>
              </div>

              {/* Follow-up & Digital Empowerment Lead */}
              <div className="bg-white border border-[#D8CCB7] rounded-2xl p-4.5 flex flex-col justify-between shadow-[0_2px_8px_rgba(28,24,20,0.04)]">
                <div>
                  <p className="text-xs font-bold text-[#0F4C45] mb-1">
                    {copy.followupSupervisor.tag}
                  </p>
                  <p className="font-honor-display text-xl sm:text-2xl font-bold text-[#1C1814] mb-2">
                    {copy.followupSupervisor.name}
                  </p>
                </div>
                <p className="font-honor-role text-xs sm:text-sm font-semibold text-[#9E6E24] pt-2.5 border-t border-[#EAE1D2]">
                  {copy.followupSupervisor.role}
                </p>
              </div>
            </div>

            {/* General Supervision — Director of the Religious Institute */}
            <div className="bg-gradient-to-b from-white to-[#F7F1E5] border-2 border-[#C89E54]/65 rounded-2xl p-5 text-center shadow-[0_3px_12px_rgba(28,24,20,0.05)]">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C45] mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#9E6E24] shrink-0" />
                <span>{copy.generalSupervisor.tag}</span>
              </div>
              <p className="font-honor-display text-2xl sm:text-3xl font-bold text-[#1C1814] mb-2">
                {copy.generalSupervisor.name}
              </p>
              <p className="font-honor-role text-sm sm:text-base font-bold text-[#0F4C45] pt-2.5 border-t border-[#E5DDD0] max-w-md mx-auto">
                {copy.generalSupervisor.role}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F3ECE0] border-t border-[#DED4C3] flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#5C5247]">
            {copy.modalFooterNote}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-guardian-primary px-5 py-2 text-xs"
          >
            {copy.closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
