import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import  Flag  from "react-world-flags";


const data = [
  { label: "Nederlands", code: "nl-NL", flagCode: "NL" },
  { label: "Français", code: "fr-BE", flagCode: "FR" },
  { label: "English", code: "en-GB" , flagCode: "GB" },  
];

const dataMap = Object.fromEntries(data.map((item) => [item.code, item]));

interface LanguagePickerProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

export function LanguagePicker({
  selectedLanguage,
  setSelectedLanguage,
}: LanguagePickerProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });


  const options = data.map((item) => (
    <Combobox.Option value={item.code} key={item.code}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Flag code={item.flagCode} style={{ width: 18, height: 18 }} />
        {item.label}
      </div>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(code) => {
        setSelectedLanguage(code);  
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Flag
              code={dataMap[selectedLanguage]?.flagCode || ""}
              style={{ width: 22, height: 22 }}
            />
            {dataMap[selectedLanguage]?.label || (
              <Input.Placeholder>Select language</Input.Placeholder>
            )}
          </div>
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
