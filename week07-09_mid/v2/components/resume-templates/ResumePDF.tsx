import { Page, View, Document } from '@react-pdf/renderer'
import { styles, spacing } from './styles'
import { ResumePDFProfile } from './ResumePDFProfile'
import { ResumePDFWorkExperiences } from './ResumePDFWorkExperience'
import { ResumePDFEducation } from './ResumePDFEducation'
import { DEFAULT_FONT_COLOR } from './types'
import type { Resume, Settings } from './types'

export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume
  settings: Settings
  isPDF?: boolean
}) => {
  const { profile, workExperiences, educations } = resume
  const { name } = profile
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
  } = settings
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR

  const showFormsOrder = formsOrder.filter((form) => formToShow[form])

  type ShowForm = keyof typeof formToShow
  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperiences
        heading={formToHeading['workExperiences']}
        workExperiences={workExperiences}
        themeColor={themeColor}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading['educations']}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints['educations']}
      />
    ),
    projects: () => <></>,
    skills: () => <></>,
    custom: () => <></>,
  }

  return (
    <Document title={`${name} Resume`} author={name} producer={'ResumeAI'}>
      <Page
        size={documentSize === 'A4' ? 'A4' : 'LETTER'}
        style={{
          ...styles.flexCol,
          color: DEFAULT_FONT_COLOR,
          fontFamily,
          fontSize: fontSize + 'pt',
        }}
      >
        {Boolean(settings.themeColor) && (
          <View
            style={{
              width: spacing['full'],
              height: spacing[3.5],
              backgroundColor: themeColor,
            }}
          />
        )}
        <View
          style={{
            ...styles.flexCol,
            padding: `${spacing[0]} ${spacing[20]}`,
          }}
        >
          <ResumePDFProfile
            profile={profile}
            themeColor={themeColor}
            isPDF={isPDF}
          />
          {showFormsOrder.map((form) => {
            const Component = formTypeToComponent[form]
            return <Component key={form} />
          })}
        </View>
      </Page>
    </Document>
  )
}
