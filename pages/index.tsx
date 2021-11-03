import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Select, { StylesConfig, ThemeConfig } from 'react-select';
import BadgeView, { Flag, FlagName, FLAGS } from '../components/BadgeView';

interface FlagOption {
    value: string
    label: string
    isDisabled?: boolean
}

const FLAG_OPTIONS = (() => {
    const o: FlagOption[] = [];
    for (const key in FLAGS) {
        if (Object.prototype.hasOwnProperty.call(FLAGS, key)) {
            const flag = (FLAGS as any)[key] as Flag;
            o.push({
                value: key,
                label: flag.name,
            });
        }
    }
    o.push({
        value: 'more-soon',
        label: 'More coming!',
        isDisabled: true,
    });
    return o;
})();

const DROPDOWN_STYLE: StylesConfig = {
    container: (provided) => ({
        ...provided,
        width: 200,
    }),
}

const Home: NextPage = () => {
    const [textColour, setTextColour] = useState('#000000');
    const [flag, setFlag] = useState<FlagOption>(FLAG_OPTIONS[0]);
    const [pronouns, setPronouns] = useState('they/them');

    return (
        <div className="py-8 dark:text-white dark:bg-gray-800 h-screen transition-colors">
            <Head>
                <title>Pronoun Badge Generator</title>
                <meta name="description" content="Generate cool little pronoun badges" />
            </Head>

            <main className="px-16">
                <BadgeView pronouns={pronouns} flag={flag.value as FlagName} textColour={textColour} />
                <div>
                    <label htmlFor="text-col-in">Text colour: </label>
                    <input id="text-col-in" type="color" value={textColour} onChange={e => setTextColour(e.target.value)} />
                </div>

                <Select className="dark:text-black" options={FLAG_OPTIONS}
                        styles={DROPDOWN_STYLE}
                        value={flag}
                        onChange={(v) => setFlag(v as any)} />

                <br />

                <label htmlFor="pronouns-in">Pronouns: </label>
                <input id="pronouns-in" type="text"
                       className="dark:bg-gray-600 border-2 border-gray-300 dark:border-white rounded p-1"
                       value={pronouns} onChange={(e) => setPronouns(e.target.value)} />
            </main>

            <footer className="p-2">
                Created by{' '}
                <a href="https://ashisbored.github.io/" target="_blank" rel="noopener noreferrer" className="underline">
                    Ash
                </a>
                {' '}with{' '}
                <a href="https://github.com/ashisbored/pronoun-badge-generator" target="_blank" rel="noopener noreferrer" className="underline">
                    ❤️ and ✨
                </a>
            </footer>
        </div>
    )
}

export default Home;
