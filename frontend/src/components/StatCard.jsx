import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, color = 'indigo', delay = 0 }) => {

    const colorStyles = {
        indigo: {
            iconBg: 'bg-indigo-500/10',
            iconText: 'text-indigo-400',
            border: 'border-indigo-500/20'
        },
        green: {
            iconBg: 'bg-emerald-500/10',
            iconText: 'text-emerald-400',
            border: 'border-emerald-500/20'
        },
        pink: {
            iconBg: 'bg-pink-500/10',
            iconText: 'text-pink-400',
            border: 'border-pink-500/20'
        },
        blue: {
            iconBg: 'bg-blue-500/10',
            iconText: 'text-blue-400',
            border: 'border-blue-500/20'
        }
    };

    const style = colorStyles[color] || colorStyles.indigo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`glass-card p-6 relative overflow-hidden group hover:border-slate-600 transition-all duration-300`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
                </div>
                <div className={`p-3 rounded-xl ${style.iconBg} ${style.iconText}`}>
                    <Icon size={24} />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/10">
                        {trend}
                    </span>
                    <span className="text-slate-500 text-xs">vs last month</span>
                </div>
            )}

            {/* Background decoration */}
            <div className={`absolute -bottom-4 -right-4 ${style.iconText} opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500`}>
                <Icon size={100} />
            </div>
        </motion.div>
    );
};

export default StatCard;
