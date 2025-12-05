import { View } from '@react-pdf/renderer'
import { ResumePDFSection, ResumePDFText, ResumePDFBulletList } from './common'
import { styles, spacing } from './styles'
import type { ResumeWorkExperience } from './types'

export const ResumePDFWorkExperiences = ({
  heading,
  workExperiences,
  themeColor,
}: {
  heading: string
  workExperiences: ResumeWorkExperience[]
  themeColor: string
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => (
        <View key={idx}>
          <View style={{ ...styles.flexRowBetween, marginTop: spacing['0.5'] }}>
            <ResumePDFText bold={true}>{company}</ResumePDFText>
            <ResumePDFText>{date}</ResumePDFText>
          </View>
          <ResumePDFText>{jobTitle}</ResumePDFText>
          <View style={{ ...styles.flexCol, marginTop: spacing['1.5'] }}>
            <ResumePDFBulletList items={descriptions} />
          </View>
        </View>
      ))}
    </ResumePDFSection>
  )
}
