import type { ModelSetting } from '@prisma/client'
import { dumpModelSettingToPlcWords } from '../dumpModelSettingToPlcWords'

interface DumpModelSettingsToPlc {
  plcWriter: (writes: { address: string; value: number | boolean }[]) => void
  selectedModelDetails: ModelSetting | null
}

export const dumpModelSettingsToPlc = ({
  plcWriter,
  selectedModelDetails
}: DumpModelSettingsToPlc) => {
  const words = dumpModelSettingToPlcWords(selectedModelDetails as ModelSetting)
  plcWriter([
    { address: 'D700', value: words.D700 },
    { address: 'D701', value: words.D701 },
    { address: 'D702', value: words.D702 },
    { address: 'D703', value: words.D703 },
    { address: 'D704', value: words.D704 },
    { address: 'D705', value: words.D705 },
    { address: 'D706', value: words.D706 },
    { address: 'D707', value: words.D707 },
    { address: 'D708', value: words.D708 },
    { address: 'D730', value: words.D730 },
    { address: 'D731', value: words.D731 },
    { address: 'D732', value: words.D732 },
    { address: 'D733', value: words.D733 },
    { address: 'D734', value: words.D734 },
    { address: 'D735', value: words.D735 },
    { address: 'D750', value: words.D750 },
    { address: 'D751', value: words.D751 },
    { address: 'D752', value: words.D752 },
    { address: 'D753', value: words.D753 },
    { address: 'D754', value: words.D754 },
    { address: 'D755', value: words.D755 },
    { address: 'D770', value: words.D770 },
    { address: 'D771', value: words.D771 },
    { address: 'D772', value: words.D772 },
    { address: 'D773', value: words.D773 },
    { address: 'D774', value: words.D774 },
    { address: 'D775', value: words.D775 },
    { address: 'D776', value: words.D776 },
    { address: 'D777', value: words.D777 },
    { address: 'D778', value: words.D778 },
    { address: 'D779', value: words.D779 },
    { address: 'D780', value: words.D780 },
    { address: 'D782', value: words.D782 },
    { address: 'D782', value: words.D782 },
    { address: 'D783', value: words.D783 },
    { address: 'D790', value: words.D790 },
    { address: 'D791', value: words.D791 },
    { address: 'D792', value: words.D792 },
    { address: 'D793', value: words.D793 },
    { address: 'D794', value: words.D794 },
    { address: 'D795', value: words.D795 },
    { address: 'D796', value: words.D796 },
    { address: 'D797', value: words.D797 },
    { address: 'D798', value: words.D798 },
    { address: 'D799', value: words.D799 },
    { address: 'D800', value: words.D800 },
    { address: 'D801', value: words.D801 },
    { address: 'D802', value: words.D802 },
    { address: 'D803', value: words.D803 },
    { address: 'D804', value: words.D804 },
    { address: 'D810', value: words.D810 },
    { address: 'D811', value: words.D811 },
    { address: 'D812', value: words.D812 },
    { address: 'D860', value: words.D860 },
    { address: 'D861', value: words.D861 },
    { address: 'D862', value: words.D862 },
    { address: 'D863', value: words.D863 },
    { address: 'D864', value: words.D864 },
    { address: 'D865', value: words.D865 },
    { address: 'D866', value: words.D866 },
    { address: 'D867', value: words.D867 },
    { address: 'D868', value: words.D868 },
    { address: 'D869', value: words.D869 },
    { address: 'D870', value: words.D870 },
    { address: 'D872', value: words.D872 },
    { address: 'D873', value: words.D873 },
    { address: 'D874', value: words.D874 },
    { address: 'D875', value: words.D875 },
    { address: 'D876', value: words.D876 },
    { address: 'D877', value: words.D877 },
    { address: 'D878', value: words.D878 },
    { address: 'D879', value: words.D879 }
    // Add more addresses as needed
  ])
}
